import React, { useState, useEffect } from "react";
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
  Box,
} from "@mui/material";
import commodities from "../../assets/commodities.json";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const organizeCommoditiesByType = (commodities) => {
  return commodities.reduce((acc, commodity) => {
    if (!acc[commodity.type]) {
      acc[commodity.type] = [];
    }
    acc[commodity.type].push(commodity);
    return acc;
  }, {});
};

export default function MultipleSelectCheckmarksInputs() {
  const [commoditiesSelected, setCommoditiesSelected] = useState({});
  const [commoditiesByType, setCommoditiesByType] = useState({});

  useEffect(() => {
    const organizedCommodities = organizeCommoditiesByType(commodities);
    setCommoditiesByType(organizedCommodities);
    // Initialize selection state for each commodity type
    const initialSelections = Object.keys(organizedCommodities).reduce(
      (acc, type) => {
        acc[type] = [];
        return acc;
      },
      {}
    );
    setCommoditiesSelected(initialSelections);
  }, []);

  const handleChange = (type) => (event) => {
    const {
      target: { value },
    } = event;
    setCommoditiesSelected({
      ...commoditiesSelected,
      [type]: typeof value === "string" ? value.split(",") : value,
    });
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {Object.keys(commoditiesByType).map((type) => (
        <FormControl key={type} sx={{ m: 1, minWidth: 150 }} size="small">
          <InputLabel id={`select-${type}-label`}>{type}</InputLabel>
          <Select
            labelId={`select-${type}-label`}
            id={`select-${type}`}
            multiple
            value={commoditiesSelected[type]}
            onChange={handleChange(type)}
            input={<OutlinedInput label={type} />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {commoditiesByType[type].map((commodity) => (
              <MenuItem key={commodity.resource} value={commodity.resource}>
                <Checkbox
                  checked={
                    commoditiesSelected[type].indexOf(commodity.resource) > -1
                  }
                />
                <ListItemText primary={commodity.resource} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
}
