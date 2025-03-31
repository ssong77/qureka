import React, { useState } from 'react';
import {
  Box, Typography, Container, Select, MenuItem,
  FormControl, InputLabel, Button, Tabs, Tab, Switch, Paper
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import Grid from '@mui/material/Grid';

function UploadPage() {
  const [tab, setTab] = useState(0);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFileName(event.target.files[0].name);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f4f2f7', minHeight: '100vh', pt: 4 }}>
      <Container maxWidth="lg">
        {/* 상단 텍스트 */}
        <Typography variant="h6" gutterBottom>
          문서 업로드 / 문서 요약
        </Typography>

        {/* 업로드 영역 */}
        <Paper
          variant="outlined"
          sx={{
            border: '2px dashed #ccc',
            backgroundColor: '#fff',
            padding: 4,
            textAlign: 'center',
            mb: 4
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

        {/* 필터 토글 & 탭 */}
        <Box display="flex" alignItems="center" mb={2}>
          <Switch
            checked={filtersVisible}
            onChange={() => setFiltersVisible(!filtersVisible)}
          />
          <Tabs value={tab} onChange={handleTabChange} sx={{ ml: 2 }}>
            <Tab label="핵심" />
            <Tab label="주제" />
            <Tab label="목차" />
            <Tab label="목차 아무개" />
          </Tabs>
        </Box>

        {/* 필터 영역 */}
        {filtersVisible && (
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>분야</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="언어">언어</MenuItem>
                  <MenuItem value="철학">철학</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>난이도</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="고등">고등</MenuItem>
                  <MenuItem value="대학">대학</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>문단 수</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="1-5">1-5</MenuItem>
                  <MenuItem value="5-10">5-10</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>글자 수</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="100-200">100-200</MenuItem>
                  <MenuItem value="200-300">200-300</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>주제 개수</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3+">3+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {/* 요약 생성 버튼 */}
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