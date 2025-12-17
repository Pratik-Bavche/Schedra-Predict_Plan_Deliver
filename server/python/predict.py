import sys
import json

# Simple mock prediction logic
def predict(data):
    # In a real scenario, this would load a .pkl model and predict
    # Data is expected to be a list of features or a dict
    
    # Mock Logic:
    # If complexity > 5, delay is high.
    # Inflation adds to cost.
    
    complexity = data.get('complexity', 1)
    inflation = data.get('inflation', 0)
    base_cost = data.get('base_cost', 100000)
    
    predicted_cost = base_cost * (1 + (inflation / 100))
    predicted_delay_days = complexity * 2.5
    
    risk_score = (complexity * 10) + inflation
    
    result = {
        "predicted_cost": round(predicted_cost, 2),
        "predicted_delay_days": round(predicted_delay_days, 0),
        "risk_score": round(risk_score, 2),
        "status": "Success",
        "model_version": "v1.0-mock"
    }
    
    return result

if __name__ == "__main__":
    try:
        # Read input from stdin (Node.js will send JSON string)
        input_data = sys.argv[1]
        data = json.loads(input_data)
        
        output = predict(data)
        
        # Print result to stdout (Node.js will capture this)
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
