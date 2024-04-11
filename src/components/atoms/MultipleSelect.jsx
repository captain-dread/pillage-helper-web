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

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
      width: 175,
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

export default function MultipleSelectCheckmarksInputs({
  commoditiesSelected,
  setCommoditiesSelected,
}) {
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

    // Convert selected resource names back to their full commodity objects
    const selectedCommodities =
      typeof value === "string"
        ? value
            .split(",")
            .map((resource) =>
              commoditiesByType[type].find(
                (commodity) => commodity.resource === resource
              )
            )
        : value.map((resource) =>
            commoditiesByType[type].find(
              (commodity) => commodity.resource === resource
            )
          );

    setCommoditiesSelected({
      ...commoditiesSelected,
      [type]: selectedCommodities,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        pt: 1,
      }}
    >
      {Object.keys(commoditiesByType).map((type) => (
        <FormControl key={type} sx={{ m: 0.5, minWidth: 150 }} size="small">
          <InputLabel id={`select-${type}-label`}>{type}</InputLabel>
          <Select
            labelId={`select-${type}-label`}
            id={`select-${type}`}
            multiple
            value={commoditiesSelected[type].map(
              (commodity) => commodity.resource
            )}
            onChange={handleChange(type)}
            input={<OutlinedInput label={type} />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {commoditiesByType[type].map((commodity) => (
              <MenuItem
                key={commodity.resource}
                value={commodity.resource}
                sx={{ p: 0 }}
              >
                <Checkbox
                  checked={
                    commoditiesSelected[type]
                      .map((commodity) => commodity.resource)
                      .indexOf(commodity.resource) > -1
                  }
                />
                <ListItemText
                  primary={commodity.resource}
                  sx={{ fontSize: ".9rem" }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
}
