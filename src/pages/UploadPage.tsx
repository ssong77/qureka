import React, { useState } from 'react';
import {
  Box, Typography, Container, Grid, Select, MenuItem,
  FormControl, InputLabel, Button, Tabs, Tab, Paper
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

function UploadPage() {
  const [tab, setTab] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [summary, setSummary] = useState(''); // 요약 결과 상태

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleGenerateSummary = () => {
    setSummary('');
    setTimeout(() => {
      setSummary(` 제목
소프트웨어 개발 방법론 활용

목차 요약

소프트웨어 개발 방법론 개요

전통적 개발 모델: 폭포수, 프로토타입

반복적/점증적 모델: 나선형, RAD

애자일 방법론 및 XP, Scrum

방법론 선택 시 고려 요소

핵심 내용 요약

소프트웨어 개발 방법론은 프로젝트 품질과 생산성 향상을 위한 체계적 절차이다.

폭포수 모델은 단계적이며 예측 가능하지만, 유연성이 부족하다.

애자일은 유연성과 사용자 중심 개발에 적합하나, 명확한 계획 수립이 어려울 수 있다.

프로젝트 환경, 팀 규모, 요구사항 변화 가능성을 고려해 적절한 방법론을 선택해야 한다.

실무에서는 혼합형 접근이 자주 활용되며, 팀 역량과 커뮤니케이션이 핵심이다.

`);
    }, 1000);
  };

  const renderFilters = () => {
    switch (tab) {
      case 0: // 기본 요약
        return (
          <Box display="flex" gap={2} flexWrap="wrap">
            {renderSelect('분야', ['언어', '철학'])}
            {renderSelect('난이도', ['고등', '대학'])}
          </Box>
        );
      case 1: // 핵심 요약
        return (
          <Box display="flex" gap={2} flexWrap="wrap">
            {renderSelect('문단 수', ['1~5', '5~10'])}
            {renderSelect('글자 수', ['100~200', '200~300'])}
          </Box>
        );
      case 2: // 주제 요약
        return (
          <Box display="flex" gap={2} flexWrap="wrap">
            {renderSelect('주제 개수', ['1', '2', '3+'])}
          </Box>
        );
      case 3: // 목차 요약
        return (
          <Box display="flex" gap={2} flexWrap="wrap">
            {renderSelect('문단 수', ['1~5', '5~10'])}
            {renderSelect('주제 개수', ['1', '2', '3+'])}
          </Box>
        );
      case 4: // 키워드 요약
        return (
          <Box display="flex" gap={2} flexWrap="wrap">
            {renderSelect('키워드 수', ['3', '5', '10'])}
          </Box>
        );
      default:
        return null;
    }
  };

  const renderSelect = (label: string, options: string[]) => {
    const id = `select-${label}`;
    return (
      <FormControl key={label} sx={{ minWidth: 120 }}>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          label={label}
          defaultValue=""
        >
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <Box sx={{ bgcolor: '#f4f2f7', minHeight: '100vh', px: 2, py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">업로드</Typography>
        <Typography variant="body1" align="center" mb={4}>어떤 문서를 요약하시렵니까?</Typography>

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
          {!fileName ? (
            <Typography variant="body2" mt={2}>또는 파일을 여기로 끌어 놓으세요</Typography>
          ) : (
            <Typography variant="h6" fontWeight="bold" mt={2}>{fileName}</Typography>
          )}
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

        <Box textAlign="center" mb={4}>
          {!summary ? (
            <Button variant="contained" color="secondary" size="large" onClick={handleGenerateSummary}>
              ✦ 개요 생성
            </Button>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button variant="outlined" color="primary">요약 내용 변경</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary">문제 생성</Button>
              </Grid>
            </Grid>
          )}
        </Box>

        {summary && (
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 2,
              p: 3,
              boxShadow: 2,
              maxHeight: 300,
              overflowY: 'auto',
              whiteSpace: 'pre-line',
            }}
          >
            <Typography variant="h6" gutterBottom>문서 요약 결과</Typography>
            <Typography variant="body1">{summary}</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default UploadPage;
