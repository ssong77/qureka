import React, { useState } from 'react';
import {
  Box, Typography, Container, Grid, Select, MenuItem,
  FormControl, InputLabel, Button, Tabs, Tab, Paper
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';


function UploadPage() {
  const [tab, setTab] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFileName(event.target.files[0].name);
    }
  };

  const renderFilters = () => {
    switch (tab) {
      case 0: // 핵심
        return (
          <>
            {renderSelect('분야', ['언어', '철학'])}
            {renderSelect('난이도', ['고등', '대학'])}
            {renderSelect('문단 수', ['1~5', '5~10'])}
          </>
        );
      case 1: // 주제
        return (
          <>
            {renderSelect('분야', ['언어', '철학'])}
            {renderSelect('주제 개수', ['1', '2', '3+'])}
          </>
        );
      case 2: // 목차
        return (
          <>
            {renderSelect('글자 수', ['100~200', '200~300'])}
            {renderSelect('주제 개수', ['1', '2', '3+'])}
          </>
        );
      case 3: // 아무개
        return (
          <>
            {renderSelect('키잉', ['초등', '중등', '고등'])}
          </>
        );
      default:
        return null;
    }
  };

  const renderSelect = (label: string, options: string[]) => {
    const id = `select-${label}`;
  
    return (
      <Grid item xs={12} sm={6} md={4} key={label}>
        <FormControl fullWidth>
          <InputLabel id={`${id}-label`}>{label}</InputLabel>
          <Select
            labelId={`${id}-label`}
            id={id}
            label={label} // 
            defaultValue=""
          >
            {options.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: '#f4f2f7',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: 3,
          p: 4,
          boxShadow: 3,
          width: '100%',
          maxWidth: 800,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          업로드
        </Typography>
        <Typography variant="body1" align="center" mb={4}>
          어떤 문서를 요약하시렵니까?
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            border: '2px dashed #ccc',
            backgroundColor: '#f9f9f9',
            padding: 4,
            textAlign: 'center',
            mb: 4,
          }}
        >
          <CloudUpload sx={{ fontSize: 60, color: '#1976d2' }} />
          <Box mt={2}>
            <Button component="label" variant="contained">
              파일 선택
              <input hidden type="file" onChange={handleFileUpload} />
            </Button>
          </Box>
          <Typography variant="body2" mt={2}>
            또는 파일을 여기로 끌어 놓으세요
          </Typography>
          {fileName && <Typography mt={1}>📄 {fileName}</Typography>}
        </Paper>

        <Box mb={2}>
          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
            <Tab label="핵심" />
            <Tab label="주제" />
            <Tab label="목차" />
            <Tab label="아무개" />
          </Tabs>
        </Box>

        <Grid container spacing={2} mb={4}>
          {renderFilters()}
        </Grid>

        <Box textAlign="center">
          <Button variant="contained" color="secondary" size="large">
            ✦ 개요 생성
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default UploadPage;
