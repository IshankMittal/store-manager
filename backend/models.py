from flask_sqlalchemy import SQLAlchemy

# ==========================================
# DATABASE INSTANCE
# ==========================================

db = SQLAlchemy()


# ==========================================
# PRODUCT MODEL
# ==========================================

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(100),
        nullable=False,
        unique=True
    )

    unit = db.Column(
        db.String(20),
        nullable=False
    )

    current_quantity = db.Column(
        db.Integer,
        default=0
    )
    
    is_favorite = db.Column(
        db.Boolean,
        default=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "unit": self.unit,
            "current_quantity": self.current_quantity,
            "is_favorite": self.is_favorite
        }

    def __repr__(self):
        return f"<Product {self.name}>"


# ==========================================
# TRANSACTION MODEL
# ==========================================

class Transaction(db.Model):
    __tablename__ = "transactions"

    # Primary Key
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # Product Reference
    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    # IN or OUT
    transaction_type = db.Column(
        db.String(10),
        nullable=False
    )

    # Quantity Added/Removed
    quantity = db.Column(
        db.Integer,
        nullable=False
    )

    # Optional Note
    note = db.Column(
        db.String(255)
    )

    # Timestamp
    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # Relationship with Product
    product = db.relationship(
        "Product",
        backref="transactions"
    )

    # Convert Object to JSON
    def to_dict(self):
        return {
            "id": self.id,
            "product": self.product.name,
            "type": self.transaction_type,
            "quantity": self.quantity,
            "note": self.note,
            "created_at": self.created_at.strftime("%Y-%m-%d")
        }

    def __repr__(self):
        return f"<Transaction {self.id}>"