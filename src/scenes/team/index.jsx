import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, MenuItem, Select } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { tokens } from "../../theme";
import Header from "../../components/Header";

const ShuttleStatus = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [shuttles, setShuttles] = useState([]);
  const [view, setView] = useState('summary'); // State to manage the current view
  const [selectedAisle, setSelectedAisle] = useState('Aisle 1'); // State to manage selected aisle in Aisle-wise view
  const [aisleGroups, setAisleGroups] = useState({});

  useEffect(() => {
    const fetchShuttleStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3001/shuttles');
        setShuttles(response.data);
        groupShuttlesByAisle(response.data);
      } catch (error) {
        console.error('Error fetching shuttle status:', error);
      }
    };

    const groupShuttlesByAisle = (shuttles) => {
      // Define IP address ranges or specific IPs for each aisle
      const ipMappings = {
        'Aisle 1': ['192.168.105.132', '192.168.105.137', '192.168.104.12', '192.168.104.17', '192.168.104.22', '192.168.104.27', '192.168.104.32', '192.168.104.37', '192.168.104.42', '192.168.104.47', '192.168.104.52', '192.168.104.57', '192.168.104.62', '192.168.104.67', '192.168.104.72', '192.168.104.77', '192.168.104.82', '192.168.104.87', '192.168.104.92'],
        'Aisle 2': ['192.168.104.97', '192.168.104.102', '192.168.104.107', '192.168.104.112', '192.168.104.117', '192.168.104.122', '192.168.104.127', '192.168.104.132', '192.168.104.137', '192.168.104.142', '192.168.104.147', '192.168.104.152', '192.168.104.157', '192.168.104.162', '192.168.104.167', '192.168.104.172', '192.168.104.177', '192.168.104.182', '192.168.104.187'],
        'Aisle 3': ['192.168.104.192', '192.168.104.197', '192.168.104.202', '192.168.104.207', '192.168.104.212', '192.168.104.217', '192.168.104.222', '192.168.104.227', '192.168.104.232', '192.168.104.237', '192.168.104.242', '192.168.104.247', '192.168.105.2', '192.168.105.7', '192.168.105.12', '192.168.105.17', '192.168.105.22', '192.168.105.27', '192.168.105.32'],
        'Aisle 4': ['192.168.105.37', '192.168.105.42', '192.168.105.47','192.168.105.52', '192.168.105.57', '192.168.105.62', '192.168.105.67', '192.168.105.72', '192.168.105.77', '192.168.105.82', '192.168.105.87', '192.168.105.92', '192.168.105.97', '192.168.105.102', '192.168.105.107', '192.168.105.112', '192.168.105.117', '192.168.105.122', '192.168.105.127'],
      };

      const grouped = Object.keys(ipMappings).reduce((acc, aisle) => {
        acc[aisle] = shuttles.filter(shuttle => ipMappings[aisle].includes(shuttle.shuttle_ip));
        return acc;
      }, {});

      setAisleGroups(grouped);
    };

    fetchShuttleStatus();
    const intervalId = setInterval(fetchShuttleStatus, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const columns = [
    { field: "shuttle_name", headerName: "Name", flex: 1 },
    { field: "shuttle_ip", headerName: "IP Address", flex: 1 },
    {
      field: "shuttle_state",
      headerName: "Status",
      flex: 1,
      renderCell: ({ value }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          backgroundColor={value === 'up' ? colors.greenAccent[600] : colors.redAccent[600]}
          borderRadius="4px"
        >
          <Typography color={colors.grey[100]}>{value}</Typography>
        </Box>
      )
    },
    { field: "state_timestamp", headerName: "Timestamp", flex: 1 },
  ];

  const summaryGroups = [
    { name: "ASRS Aisle 1", online: aisleGroups['Aisle 1']?.filter(s => s.shuttle_state === 'up').length || 0, offline: aisleGroups['Aisle 1']?.filter(s => s.shuttle_state === 'down').length || 0 },
    { name: "ASRS Aisle 2", online: aisleGroups['Aisle 2']?.filter(s => s.shuttle_state === 'up').length || 0, offline: aisleGroups['Aisle 2']?.filter(s => s.shuttle_state === 'down').length || 0 },
    { name: "ASRS Aisle 3", online: aisleGroups['Aisle 3']?.filter(s => s.shuttle_state === 'up').length || 0, offline: aisleGroups['Aisle 3']?.filter(s => s.shuttle_state === 'down').length || 0 },
    { name: "ASRS Aisle 4", online: aisleGroups['Aisle 4']?.filter(s => s.shuttle_state === 'up').length || 0, offline: aisleGroups['Aisle 4']?.filter(s => s.shuttle_state === 'down').length || 0 },
  ];

  const renderSummaryView = () => (
    <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="20px">
      {summaryGroups.map((group, index) => (
        <Box
          key={index}
          p="10px"
          borderRadius="8px"
          backgroundColor={colors.primary[400]}
          textAlign="center"
        >
          <Typography variant="h6" color={colors.grey[100]}>{group.name}</Typography>
          <Box mt="10px" display="flex" justifyContent="space-between">
            <Typography color={colors.greenAccent[600]}>{group.online}</Typography>
            <Typography color={colors.redAccent[600]}>{group.offline}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );

  const renderAisleView = (aisle) => (
    <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="20px">
      {aisleGroups[aisle]?.map(shuttle => (
        <Box
          key={shuttle.id}
          p="10px"
          backgroundColor={shuttle.shuttle_state === 'up' ? colors.greenAccent[600] : colors.redAccent[600]}
          borderRadius="8px"
          textAlign="center"
        >
          <Typography color={colors.grey[100]}>{shuttle.shuttle_name}</Typography>
          <Typography color={colors.grey[100]}>{shuttle.shuttle_ip}</Typography>
          <Typography color={colors.grey[100]}>{shuttle.shuttle_state}</Typography>
          <Typography color={colors.grey[100]}>{new Date(shuttle.state_timestamp).toLocaleString()}</Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box m="20px">
      <Header title="Shuttle" subtitle="Shuttle States" />
      <Box mb="20px">
        <Select
          value={view === 'grid' ? selectedAisle : view} // Show aisle selection only if in grid view
          onChange={(e) => {
            if (['summary', 'list'].includes(e.target.value)) {
              setView(e.target.value);
            } else {
              setView('grid');
              setSelectedAisle(e.target.value);
            }
          }}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="summary">Summary View</MenuItem>
          <MenuItem value="list">List View</MenuItem>
          <MenuItem value="Aisle 1">Aisle 1</MenuItem>
          <MenuItem value="Aisle 2">Aisle 2</MenuItem>
          <MenuItem value="Aisle 3">Aisle 3</MenuItem>
          <MenuItem value="Aisle 4">Aisle 4</MenuItem>
        </Select>
      </Box>

      {view === 'summary' ? (
        renderSummaryView()
      ) : view === 'list' ? (
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <DataGrid rows={shuttles} columns={columns} checkboxSelection />
        </Box>
      ) : (
        renderAisleView(selectedAisle)
      )}
    </Box>
  );
};

export default ShuttleStatus;
