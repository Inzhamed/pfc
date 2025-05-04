
import { useEffect, useRef, useState } from 'react';
import { Defect, SeverityLevel } from '@/data/defect-data';

// Define leaflet type for global window
declare global {
  interface Window {
    L: any;
  }
}

// Add required leaflet libraries in index.html
const addLeafletScripts = () => {
  // Add leaflet CSS
  const leafletCss = document.createElement('link');
  leafletCss.rel = 'stylesheet';
  leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  leafletCss.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  leafletCss.crossOrigin = '';
  document.head.appendChild(leafletCss);

  // Add leaflet JS
  const leafletJs = document.createElement('script');
  leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  leafletJs.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
  leafletJs.crossOrigin = '';
  document.body.appendChild(leafletJs);
};

interface DefectMapProps {
  defects?: Defect[];
  onDefectSelect: (defect: Defect) => void;
  selectedDefect?: Defect | null;
  className?: string;
}

// Get marker color based on severity
const getSeverityColor = (severity: SeverityLevel): string => {
  switch (severity) {
    case 'critical': return '#EF4444'; // Red
    case 'high': return '#F97316';     // Orange
    case 'medium': return '#FBBF24';   // Yellow
    case 'low': return '#22C55E';      // Green
    default: return '#3B82F6';         // Blue
  }
};

// Map component
export const DefectMap: React.FC<DefectMapProps> = ({ 
  defects = [],
  onDefectSelect, 
  selectedDefect,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any>({});

  // Initialize map
  useEffect(() => {
    addLeafletScripts();

    // Wait for leaflet to load
    const checkLeaflet = setInterval(() => {
      if (window.L) {
        clearInterval(checkLeaflet);
        initMap();
      }
    }, 100);

    return () => {
      clearInterval(checkLeaflet);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, []);

  // Initialize the map
  const initMap = () => {
    if (!mapRef.current || leafletMapRef.current) return;

    const L = window.L;
    
    // Create map centered on Chicago
    const map = L.map(mapRef.current, {
      center: [41.8781, -87.6298], // Chicago
      zoom: 11,
      zoomControl: true,
    });

    // Add tile layer (map background)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    leafletMapRef.current = map;
    setMapLoaded(true);
  };

  // Update markers when defects change
  useEffect(() => {
    if (!mapLoaded || !leafletMapRef.current) return;

    const L = window.L;
    const map = leafletMapRef.current;
    const currentMarkers = markersRef.current;
    
    // Remove existing markers
    Object.values(currentMarkers).forEach((marker: any) => {
      map.removeLayer(marker);
    });
    markersRef.current = {};
    
    // Add markers for defects
    defects.forEach(defect => {
      const { lat, lng } = defect.location;
      
      // Create custom marker icon based on severity
      const color = getSeverityColor(defect.severity);
      const customIcon = L.divIcon({
        className: '',
        html: `<div class="w-4 h-4 rounded-full bg-${defect.status === 'resolved' ? 'severity-resolved' : `severity-${defect.severity}`} border-2 border-white shadow-md flex items-center justify-center">
          ${defect.status === 'resolved' ? '<div class="w-1.5 h-1.5 rounded-full bg-white"></div>' : ''}
        </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      
      // Create marker
      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          onDefectSelect(defect);
        });
      
      // Add pulse animation to critical markers
      if (defect.severity === 'critical' && defect.status !== 'resolved') {
        marker._icon.classList.add('animate-pulse-alert');
      }
      
      // Highlight selected defect
      if (selectedDefect && selectedDefect.id === defect.id) {
        marker._icon.innerHTML = `<div class="w-6 h-6 -ml-1 -mt-1 rounded-full border-2 border-white bg-${defect.status === 'resolved' ? 'severity-resolved' : `severity-${defect.severity}`} shadow-lg flex items-center justify-center">
          ${defect.status === 'resolved' ? '<div class="w-2 h-2 rounded-full bg-white"></div>' : ''}
        </div>`;
      }
      
      markersRef.current[defect.id] = marker;
    });
    
    // Fit bounds if there are defects
    if (defects.length > 0) {
      const bounds = L.latLngBounds(defects.map(d => [d.location.lat, d.location.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [defects, mapLoaded, selectedDefect]);

  // Update selected defect highlight
  useEffect(() => {
    if (!mapLoaded || !leafletMapRef.current) return;
    
    // Reset all markers to normal size
    Object.entries(markersRef.current).forEach(([defectId, marker]: [string, any]) => {
      const defect = defects.find(d => d.id === defectId);
      if (!defect) return;
      
      if (selectedDefect && selectedDefect.id === defectId) {
        // Highlight the selected marker
        marker._icon.innerHTML = `<div class="w-6 h-6 -ml-1 -mt-1 rounded-full border-2 border-white bg-${defect.status === 'resolved' ? 'severity-resolved' : `severity-${defect.severity}`} shadow-lg flex items-center justify-center">
          ${defect.status === 'resolved' ? '<div class="w-2 h-2 rounded-full bg-white"></div>' : ''}
        </div>`;
        
        // Center map on selected defect
        leafletMapRef.current.setView([defect.location.lat, defect.location.lng], 13);
      } else {
        // Reset to normal marker
        marker._icon.innerHTML = `<div class="w-4 h-4 rounded-full bg-${defect.status === 'resolved' ? 'severity-resolved' : `severity-${defect.severity}`} border-2 border-white shadow-md flex items-center justify-center">
          ${defect.status === 'resolved' ? '<div class="w-1.5 h-1.5 rounded-full bg-white"></div>' : ''}
        </div>`;
        
        // Re-add animation for critical defects
        if (defect.severity === 'critical' && defect.status !== 'resolved') {
          marker._icon.classList.add('animate-pulse-alert');
        }
      }
    });
  }, [selectedDefect, mapLoaded, defects]);

  return (
    <div 
      ref={mapRef} 
      className={`h-full w-full rounded-lg overflow-hidden ${className}`}
    />
  );
};

export default DefectMap;
