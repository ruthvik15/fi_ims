import requests

BASE_URL = "http://localhost:8080"  # Change this to your API base URL

def print_result(test_name, passed, expected=None, got=None, request_data=None, response_body=None):
    """
    Prints test result.
    If passed, prints only success.
    If failed, prints request, expected vs got, and response body.
    """
    if passed:
        print(f"{test_name}: ✅ PASSED")
    else:
        print(f"{test_name}: ❌ FAILED")
        if request_data:
            print(f"  Request: {request_data}")
        if expected is not None and got is not None:
            print(f"  Expected: {expected}, Got: {got}")
        if response_body:
            print(f"  Response Body: {response_body}")

def test_register_user():
    """
    Register a user.
    Expected status codes are 201 (created) or 409 (conflict if already exists).
    """
    payload = {"username": "pujar", "password": "mypasrsword"}
    res = requests.post(f"{BASE_URL}/register", json=payload)
    passed = res.status_code in [201, 409]
    print_result("User Registration", passed, "201 or 409", res.status_code, payload, res.text)

def test_login():
    """
    Login test.
    Expects 200 and JWT token in 'access_token' field.
    """
    payload = {"username": "pujar", "password": "mypasrsword"}
    res = requests.post(f"{BASE_URL}/login", json=payload)

    token = None
    passed = False

    if res.status_code == 200:
        try:
            token = res.json().get("access_token")
            passed = token is not None
        except Exception:
            passed = False

    print_result("Login Test", passed, "JWT token", token, payload, res.text)
    return token

def test_add_product(token):
    """
    Add a new product using Authorization token.
    """
    payload = {
        "name": "Phone",
        "type": "Electronics",
        "sku": "PHN-003711",
        "image_url": "https://example.com/phone.jpg",
        "description": "Latest Phone",
        "quantity": 5,
        "price": 999.99
    }

    res = requests.post(
        f"{BASE_URL}/products",
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    passed = res.status_code == 201
    if passed:
        print("Add Product: ✅ PASSED")
        try:
            return res.json().get("product_id")
        except Exception:
            return None
    else:
        print_result("Add Product", False, 201, res.status_code, payload, res.text)
        return None

def test_update_quantity(token, product_id, new_quantity):
    """
    Update quantity of a specific product.
    """
    payload = {"quantity": new_quantity}
    res = requests.put(
        f"{BASE_URL}/products/{product_id}/quantity",
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    passed = res.status_code == 200
    if passed:
        try:
            updated_info = res.json()
            updated_qty = updated_info.get("quantity", "unknown")
            print(f"Update Quantity: ✅ PASSED, New Quantity: {updated_qty}")
        except Exception:
            print("Update Quantity: ✅ PASSED, but response body is not valid JSON")
    else:
        print_result("Update Quantity", False, 200, res.status_code, payload, res.text)

def test_get_products(token, expected_quantity):
    """
    Fetch product list and check if 'Phone' exists with expected quantity.
    """
    res = requests.get(f"{BASE_URL}/products", headers={"Authorization": f"Bearer {token}"})
    if res.status_code != 200:
        print_result("Get Products", False, 200, res.status_code, None, res.text)
        return

    try:
        products = res.json()
    except Exception:
        print_result("Get Products", False, "valid JSON list", "Invalid JSON", None, res.text)
        return

    phone_products = [p for p in products if p.get("name") == "Phone"]
    if not phone_products:
        print("Get Products: ❌ FAILED — No product named 'Phone'")
        return

    phone_quantity = phone_products[0].get("quantity")
    passed = phone_quantity == expected_quantity
    print_result("Get Products", passed, expected_quantity, phone_quantity, None, products)

def run_all_tests():
    """
    Run all tests in order.
    """
    test_register_user()
    token = test_login()
    if not token:
        print("Login failed. Skipping further tests.")
        return

    product_id = test_add_product(token)
    if not product_id:
        print("Product creation failed. Skipping further tests.")
        return

    new_quantity = 15
    test_update_quantity(token, product_id, new_quantity)
    test_get_products(token, expected_quantity=new_quantity)

if __name__ == "__main__":
    run_all_tests()
