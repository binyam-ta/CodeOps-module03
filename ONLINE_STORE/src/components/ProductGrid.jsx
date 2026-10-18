"use client";

/**
 * ==============================================================================
 * PRODUCT GRID COMPONENT - SHETA (ሽታ)
 * ==============================================================================
 * Renders an accessible, responsive grid container for perfume cards:
 * - Responsive breakpoints: 1 column on mobile, 2 on tablet, 3 on desktop, 4 on wide screens.
 * - Graceful fallback empty state when search queries or category filters yield no results.
 * ==============================================================================
 */

import React from "react";
import { Grid, Box, Typography, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ProductCard from "./ProductCard";
import { SHETA_COLORS } from "../theme/theme";

export default function ProductGrid({ products, onResetFilters }) {
  // Graceful empty state
  if (!products || products.length === 0) {
    return (
      <Box
        sx={{
          py: 10,
          px: 3,
          textAlign: "center",
          backgroundColor: SHETA_COLORS.pureWhite,
          borderRadius: 4,
          border: "1px dashed rgba(107, 114, 128, 0.3)",
          maxWidth: 600,
          mx: "auto",
          my: 4
        }}
      >
        <SearchOffIcon sx={{ fontSize: 48, color: SHETA_COLORS.mutedSlate, mb: 1.5 }} />
        <Typography variant="h5" sx={{ fontFamily: "serif", fontWeight: 700, mb: 1, color: SHETA_COLORS.obsidian }}>
          No Fragrances Found
        </Typography>
        <Typography variant="body2" sx={{ color: SHETA_COLORS.mutedSlate, mb: 3 }}>
          We could not find any perfumes matching your selected filters or search terms. Try adjusting your criteria.
        </Typography>
        {onResetFilters && (
          <Button
            variant="outlined"
            onClick={onResetFilters}
            sx={{
              borderColor: SHETA_COLORS.obsidian,
              color: SHETA_COLORS.obsidian,
              "&:hover": {
                borderColor: SHETA_COLORS.royalGold,
                color: SHETA_COLORS.royalGold
              }
            }}
          >
            Clear All Filters
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 2.5, md: 3.5 }}>
      {products.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} sx={{ display: "flex" }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
