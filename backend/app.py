import csv
from io import StringIO
from flask import Response
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Product, Transaction


# ==========================================
# FLASK CONFIGURATION
# ==========================================
app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///inventory.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# ==========================================
# DATABASE INITIALIZATION
# ==========================================
db.init_app(app)

with app.app_context():
    db.create_all()

# ==========================================
# HOME ROUTE
# ==========================================
@app.route("/")
def home():
    return "Store Manager Backend Running"

# ==========================================
# PRODUCT ROUTES
# ==========================================
@app.route("/products", methods=["POST"])
def add_product():

    data = request.get_json()

    existing_product = Product.query.filter_by(
        name=data["name"]
    ).first()

    if existing_product:
        return jsonify({
            "error": "Product already exists"
        }), 400

    product = Product(
        name=data["name"],
        unit=data["unit"]
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({
        "message": "Product added successfully"
    }), 201
    
@app.route("/products", methods=["GET"])
def get_products():

    products = Product.query.all()

    return jsonify(
        [product.to_dict() for product in products]
    )

# ==========================================
# PRODUCT ROUTES
# ==========================================
@app.route("/stock/in", methods=["POST"])
def stock_in():

    data = request.get_json()

    product_id = data["product_id"]
    quantity = data["quantity"]
    if quantity <= 0:
        return jsonify({
            "error": "Quantity must be greater than 0"
        }), 400
    note = data.get("note", "")

    product = Product.query.get(product_id)

    if not product:
        return jsonify({
            "error": "Product not found"
        }), 404

    product.current_quantity += quantity

    transaction = Transaction(
        product_id=product_id,
        transaction_type="IN",
        quantity=quantity,
        note=note
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        "message": "Stock added successfully"
    }), 200
    
@app.route("/stock/out", methods=["POST"])
def stock_out():

    data = request.get_json()

    product_id = data["product_id"]
    quantity = data["quantity"]
    if quantity <= 0:
        return jsonify({
            "error": "Quantity must be greater than 0"
        }), 400
    note = data.get("note", "")

    product = Product.query.get(product_id)

    if not product:
        return jsonify({
            "error": "Product not found"
        }), 404

    if product.current_quantity < quantity:
        return jsonify({
            "error": "Not enough stock available"
        }), 400

    product.current_quantity -= quantity

    transaction = Transaction(
        product_id=product_id,
        transaction_type="OUT",
        quantity=quantity,
        note=note
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        "message": "Stock removed successfully"
    }), 200
    
    
# ==========================================
# TRANSACTION ROUTES
# ==========================================
@app.route("/transactions", methods=["GET"])
def get_transactions():

    transactions = Transaction.query.order_by(
        Transaction.created_at.desc()
    ).all()

    return jsonify(
    [transaction.to_dict() for transaction in transactions]
    )

# ==========================================
# DELETE PRODUCT
# ==========================================
@app.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):

    product = Product.query.get(product_id)

    if not product:
        return jsonify({
            "error": "Product not found"
        }), 404

    # Prevent deleting products that have history
    if product.transactions:
        return jsonify({
            "error": "Cannot delete product with transaction history"
        }), 400

    db.session.delete(product)
    db.session.commit()

    return jsonify({
        "message": "Product deleted successfully"
    })
    
@app.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):

    product = Product.query.get(product_id)

    if not product:
        return jsonify({
            "error": "Product not found"
        }), 404

    return jsonify(
    product.to_dict()
    )
    
@app.route("/products/search", methods=["GET"])
def search_products():

    query = request.args.get("q", "")

    products = Product.query.filter(
    Product.name.ilike(f"%{query}%")
    ).all()

    return jsonify(
        [product.to_dict() for product in products]
    )

@app.route("/products/<int:product_id>/transactions", methods=["GET"])
def product_transactions(product_id):

    transactions = Transaction.query.filter_by(
        product_id=product_id
    ).order_by(
        Transaction.created_at.desc()
    ).all()

    return jsonify(
    [transaction.to_dict() for transaction in transactions]
    )

# ==========================================
# DASHBOARD CONFIGURATION
# ==========================================

LOW_STOCK_THRESHOLD = 10


# ==========================================
# LOW STOCK PRODUCTS
# ==========================================

@app.route("/low-stock", methods=["GET"])
def low_stock():

    products = Product.query.filter(
        Product.current_quantity <= LOW_STOCK_THRESHOLD
    ).all()

    return jsonify([
        {
            "id": product.id,
            "name": product.name,
            "unit": product.unit,
            "current_quantity": product.current_quantity
        }
        for product in products
    ])


# ==========================================
# DASHBOARD SUMMARY
# ==========================================

@app.route("/dashboard", methods=["GET"])
def dashboard():

    total_products = Product.query.count()

    low_stock_count = Product.query.filter(
        Product.current_quantity <= LOW_STOCK_THRESHOLD
    ).count()

    total_stock_items = db.session.query(
        db.func.sum(Product.current_quantity)
    ).scalar() or 0

    recent_transactions = Transaction.query.count()

    return jsonify({
        "total_products": total_products,
        "low_stock_products": low_stock_count,
        "total_stock_items": total_stock_items,
        "total_transactions": recent_transactions
    })
    
# ==========================================
# UPDATE PRODUCT
# ==========================================

@app.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):

    product = Product.query.get(product_id)

    if not product:
        return jsonify({
            "error": "Product not found"
        }), 404

    data = request.get_json()

    new_name = data.get(
        "name",
        product.name
    ).strip().title()

    existing_product = Product.query.filter(
        db.func.lower(Product.name) == new_name.lower()
    ).first()

    if existing_product and existing_product.id != product.id:
        return jsonify({
            "error": "Product name already exists"
        }), 400

    product.name = new_name

    product.unit = data.get(
        "unit",
        product.unit
    ).strip()

    db.session.commit()

    return jsonify({
        "message": "Product updated successfully",
        "product": product.to_dict()
    })
    
# ==========================================
# EXPORT INVENTORY
# ==========================================

@app.route("/export", methods=["GET"])
def export_inventory():

    output = StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "ID",
        "Product Name",
        "Unit",
        "Current Quantity"
    ])

    products = Product.query.all()

    for product in products:
        writer.writerow([
            product.id,
            product.name,
            product.unit,
            product.current_quantity
        ])

    csv_data = output.getvalue()

    return Response(
        csv_data,
        mimetype="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=inventory.csv"
        }
    )
    
# ==========================================
# TOGGLE FAVORITE
# ==========================================

@app.route(
    "/products/<int:product_id>/favorite",
    methods=["PUT"]
)
def toggle_favorite(product_id):

    product = Product.query.get(product_id)

    if not product:
        return jsonify({
            "error": "Product not found"
        }), 404

    product.is_favorite = not product.is_favorite

    db.session.commit()

    return jsonify({
        "message": "Favorite updated",
        "is_favorite": product.is_favorite
    })
    
if __name__ == "__main__":
    app.run(debug=True)
    
