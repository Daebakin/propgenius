import React, { useEffect } from "react";
import { Project } from "../types";

interface RealEstateListingSchemaProps {
  project: Project;
}

/**
 * RealEstateListingSchema Component
 * 
 * Dynamically constructs and injects a standard-compliant Schema.org JSON-LD structured
 * data script for a 'RealEstateListing' into the document's head.
 * It also dynamically updates standard meta elements (title, description, OpenGraph)
 * to maximize SEO and visibility in search engines.
 */
export default function RealEstateListingSchema({ project }: RealEstateListingSchemaProps) {
  useEffect(() => {
    if (!project) return;

    // Helper to parse currency type from the priceRange string
    const detectCurrency = (priceStr: string): string => {
      const lower = priceStr.toLowerCase();
      if (lower.includes("ksh") || lower.includes("kes") || lower.includes("shillings")) {
        return "KES";
      }
      if (lower.includes("aed") || lower.includes("dirham")) {
        return "AED";
      }
      return "USD"; // Default to USD
    };

    // Helper to extract a single clean numeric price from a range (e.g. "From KSh 14,500,000" -> 14500000)
    const extractPriceValue = (priceStr: string): number => {
      try {
        // Remove everything that isn't a digit
        const clean = priceStr.replace(/[^0-9]/g, "");
        if (clean) {
          const num = parseInt(clean, 10);
          if (!isNaN(num)) return num;
        }
      } catch (err) {
        console.warn("Error parsing price range string for schema:", err);
      }
      return 150000; // Sensible default fallback
    };

    // Parse location parts (e.g., "Westlands, Nairobi, Kenya")
    const locationParts = project.location?.split(",").map(part => part.trim()) || [];
    const city = locationParts[1] || "Nairobi";
    const neighborhood = locationParts[0] || "Westlands";
    const country = project.isInternational ? "AE" : "KE";

    // Select suitable preview image from available virtual tour frames
    const imageUrl = project.virtualTourMedia?.livingRoom || 
                     project.virtualTourMedia?.masterBedroom ||
                     "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200";

    const currency = detectCurrency(project.priceRange || "");
    const price = extractPriceValue(project.priceRange || "");

    // Determine the type of accommodation (Apartment, House, Villa)
    const accommodationType = project.type === "Villa" || project.type === "Townhouse" 
      ? "House" 
      : "Apartment";

    // Construct the structured JSON-LD object for RealEstateListing
    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "id": `${window.location.origin}/projects/${project.id}`,
      "name": `${project.name} - Luxury ${project.type || "Apartments"}`,
      "description": project.description || project.tagline,
      "url": `${window.location.origin}/projects/${project.id}`,
      "image": [imageUrl],
      "datePosted": "2026-01-15T08:00:00Z",
      "about": {
        "@type": accommodationType,
        "name": project.name,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": neighborhood,
          "addressLocality": city,
          "addressRegion": project.isInternational ? "Dubai" : "Nairobi County",
          "addressCountry": country
        },
        "amenityFeature": project.amenities?.map(amenity => ({
          "@type": "LocationFeatureSpecification",
          "name": amenity,
          "value": true
        })) || []
      },
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": "https://schema.org/InStock",
        "validFrom": "2026-01-01T00:00:00Z",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": price,
          "priceCurrency": currency,
          "valueAddedTaxIncluded": true
        }
      }
    };

    // 1. Ingest JSON-LD schema into head
    let scriptTag = document.getElementById("property-structured-json-ld") as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "property-structured-json-ld";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLdData, null, 2);

    // 2. Dynamic SEO head tags update
    const prevTitle = document.title;
    document.title = `${project.name} | Premium ${project.type || "Apartment"} in ${project.location}`;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", project.tagline || project.description);

    // Update OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", `${project.name} | Luxury Real Estate Listing`);

    // Update OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", project.tagline || project.description);

    // Update OpenGraph Image
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement("meta");
      ogImage.setAttribute("property", "og:image");
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute("content", imageUrl);

    // Cleanup when component unmounts or active project shifts
    return () => {
      document.title = prevTitle;
      // Note: We leave the JSON-LD script tag but update it on next project select.
      // If we want to strictly remove it on complete unmount, we can delete the script tag:
      if (scriptTag) {
        scriptTag.textContent = "";
      }
    };
  }, [project]);

  // This is a headless logic-injecting component, so it renders nothing to the DOM directly
  return null;
}
