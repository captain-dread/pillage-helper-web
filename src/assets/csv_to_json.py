import csv
import json

# Replace 'your_file.csv' with the path to your actual CSV file
csv_file_path = "commodities.csv"
json_file_path = "commodities.json"

# Initialize an empty list to hold the converted data
data = []

# Open the CSV file and read data
with open(csv_file_path, mode="r", encoding="utf-8") as csv_file:
    # Create a CSV reader object. Since DictReader uses the first row as keys,
    # we'll read the headers in lowercase to ensure all keys are in lowercase.
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        # Convert each key to lowercase
        lower_case_row = {key.lower(): value for key, value in row.items()}
        data.append(lower_case_row)

# Open the JSON file and write the data
with open(json_file_path, mode="w", encoding="utf-8") as json_file:
    json.dump(data, json_file, indent=4)

print(f"Data has been successfully converted to JSON and saved to {json_file_path}.")
