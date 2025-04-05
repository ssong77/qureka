import React, { useState } from 'react';
import {
  Box, Typography, Container, Grid, Select, MenuItem,
  FormControl, InputLabel, Button, Tabs, Tab, Paper
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

function UploadPage() {
  const [tab, setTab] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  const [selectedField, setSelectedField] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [paragraphCount, setParagraphCount] = useState('');
  const [charCount, setCharCount] = useState('');
  const [topicCount, setTopicCount] = useState('');
  const [tocLevel, setTocLevel] = useState('');
  const [keywordCount, setKeywordCount] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFileName(event.target.files[0].name);
    }
  };

  const renderSelect = (label: string, value: string, onChange: any, options: string[]) => (
    <Grid item xs={12} sm={6} md={4} key={label}>
      <FormControl fullWidth>
        <InputLabel id={`${label}-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-label`}
          value={value}
          onChange={onChange}
          displayEmpty
          renderValue={(selected) => selected || label}
        >
          <MenuItem value=""><em>없음</em></MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );

  const renderFilters = () => {
    switch (tab) {
      case 0: // 기본 요약
        return (
          <>
            {renderSelect('분야', selectedField, (e) => setSelectedField(e.target.value), ['언어', '철학'])}
            {renderSelect('난이도', selectedLevel, (e) => setSelectedLevel(e.target.value), ['고등', '대학'])}
          </>
        );
      case 1: // 핵심 요약
        return (
          <>
            {renderSelect('문단 수', paragraphCount, (e) => setParagraphCount(e.target.value), ['1~5', '5~10'])}
            {renderSelect('글자 수', charCount, (e) => setCharCount(e.target.value), ['100~200', '200~300'])}
          </>
        );
      case 2: // 주제 요약
        return (
          <>
            {renderSelect('주제 개수', topicCount, (e) => setTopicCount(e.target.value), ['1', '2', '3+'])}
          </>
        );
      case 3: // 목차 요약
        return (
          <>
            {renderSelect('문단 수', paragraphCount, (e) => setParagraphCount(e.target.value), ['1~5', '5~10'])}
            {renderSelect('주제 개수', topicCount, (e) => setTopicCount(e.target.value), ['1', '2', '3+'])}
          </>
        );
      case 4: // 키워드 요약
        return (
          <>
            {renderSelect('키워드 수', keywordCount, (e) => setKeywordCount(e.target.value), ['3', '5', '10'])}
          </>
        );
      default:
        return null;
    }
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
            <Tab label="기본 요약" />
            <Tab label="핵심 요약" />
            <Tab label="주제 요약" />
            <Tab label="목차 요약" />
            <Tab label="키워드 요약" />
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
