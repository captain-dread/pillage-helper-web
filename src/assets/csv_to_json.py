import csv
import json

# Path to the input CSV file
csv_file_path = "commodities.csv"
# Path to the output JSON file
json_file_path = "commodities.json"

# Reading the CSV and converting it into a dictionary where the 'Resource' is the key
data = {}
with open(csv_file_path, mode="r", encoding="utf-8") as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        resource = row["Resource"]
        # Ensure 'Mass' and 'Volume' are correctly interpreted (as numbers or strings, based on your needs)
        mass = row["Mass"]
        volume = row["Volume"]
        data[resource] = {"mass": mass, "volume": volume}

# Writing the dictionary to a JSON file
with open(json_file_path, mode="w", encoding="utf-8") as json_file:
    json.dump(data, json_file, indent=4)
