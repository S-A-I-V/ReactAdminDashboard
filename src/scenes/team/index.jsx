import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

const ShuttleStatus = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [shuttles, setShuttles] = useState([]);

  useEffect(() => {
    const fetchShuttleStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3001/shuttles');
        setShuttles(response.data);
      } catch (error) {
        console.error('Error fetching shuttle status:', error);
      }
    };

    // Fetch data initially
    fetchShuttleStatus();

    // Set interval to fetch data every 30 seconds
    const intervalId = setInterval(fetchShuttleStatus, 30000);

    // Clean up interval on component unmount
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

  return (
    <Box m="20px">
      <Header title="Shuttle" subtitle="Shuttle States" />
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
    </Box>
  );
};

export default ShuttleStatus;
