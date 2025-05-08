import React, { useState } from 'react';
import {
  Container, Select, MenuItem,
  FormControl, InputLabel, Button, Tabs, Tab, Paper, TextField,
  Snackbar, Alert
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import Header from '../components/Header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

function UploadPage() {
  const [tab, setTab] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [summary, setSummary] = useState('');
  const [problemGenerated, setProblemGenerated] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [choices, setChoices] = useState('');
  const [choiceType, setChoiceType] = useState('');
  const [sequenceCount, setSequenceCount] = useState('');
  const [blankCount, setBlankCount] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFileName(event.target.files[0].name);
    }
  };
  
  const handleSaveProblem = () => {
    alert('문제가 저장되었습니다.');
    navigate('/mypage'); // ✅ 마이페이지로 이동
  };

  const handleGenerateSummary = () => {
    setSummary('업로드한 문서를 요약한 내용입니다.\n여기서 사용자가 직접 수정할 수 있습니다.');
  };

  const handleProblemGenerate = () => {
    setProblemGenerated(true);
  };

  const handleSaveSummary = () => {
    setOpenSnackbar(true);
  };

  const renderSelect = (label: string, options: string[]) => {
    const id = `select-${label}`;
    return (
      <FormControl key={label} sx={{ minWidth: 120 }}>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select labelId={`${id}-label`} id={id} label={label} defaultValue="">
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderFilters = () => {
    switch (tab) {
      case 0:
        return <Box display="flex" gap={2} flexWrap="wrap">{renderSelect('분야', ['언어', '철학'])}{renderSelect('난이도', ['고등', '대학'])}</Box>;
      case 1:
        return <Box display="flex" gap={2} flexWrap="wrap">{renderSelect('문단 수', ['1~5', '5~10'])}{renderSelect('글자 수', ['100~200', '200~300'])}</Box>;
      case 2:
        return <Box display="flex" gap={2} flexWrap="wrap">{renderSelect('주제 개수', ['1', '2', '3+'])}</Box>;
      case 3:
        return <Box display="flex" gap={2} flexWrap="wrap">{renderSelect('문단 수', ['1~5', '5~10'])}{renderSelect('주제 개수', ['1', '2', '3+'])}</Box>;
      case 4:
        return <Box display="flex" gap={2} flexWrap="wrap">{renderSelect('키워드 수', ['3', '5', '10'])}</Box>;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: '#f4f2f7', minHeight: '100vh', px: 2, py: 4, pt: '100px' }}>
        <Container maxWidth="md">
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
            문서 업로드 및 요약
          </Typography>

          <Paper variant="outlined" sx={{ border: '2px dashed #ccc', backgroundColor: '#f9f9f9', p: 4, textAlign: 'center', mb: 4 }}>
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

          {!summary && (
            <Box textAlign="center" mb={4}>
              <Button variant="contained" color="primary" size="large" onClick={handleGenerateSummary}>
                ✦ 개요 생성
              </Button>
            </Box>
          )}

          {summary && (
            <>
              <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 3, boxShadow: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>문서 요약 결과</Typography>
                <TextField
                  multiline
                  fullWidth
                  minRows={10}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  variant="outlined"
                />
              </Box>

              <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 3, boxShadow: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>문제 생성 세부 설정</Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="choices-label">보기 수</InputLabel>
                    <Select labelId="choices-label" value={choices} label="보기 수" onChange={(e) => setChoices(e.target.value)}>
                      <MenuItem value="4">4개</MenuItem>
                      <MenuItem value="5">5개</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="choice-type-label">보기 형식</InputLabel>
                    <Select labelId="choice-type-label" value={choiceType} label="보기 형식" onChange={(e) => setChoiceType(e.target.value)}>
                      <MenuItem value="단답형">단답형</MenuItem>
                      <MenuItem value="문장형">문장형</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="sequence-count-label">선택지 수</InputLabel>
                    <Select labelId="sequence-count-label" value={sequenceCount} label="선택지 수" onChange={(e) => setSequenceCount(e.target.value)}>
                      <MenuItem value="3">3개</MenuItem>
                      <MenuItem value="4">4개</MenuItem>
                      <MenuItem value="5">5개</MenuItem>
                      <MenuItem value="6">6개</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="blank-count-label">빈칸 수</InputLabel>
                    <Select labelId="blank-count-label" value={blankCount} label="빈칸 수" onChange={(e) => setBlankCount(e.target.value)}>
                      <MenuItem value="1">1개</MenuItem>
                      <MenuItem value="2">2개</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Grid container spacing={2} justifyContent="center" mb={4}>
                <Grid item>
                  <Button variant="outlined" color="secondary" onClick={handleSaveSummary}>
                    요약 내용 저장
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleProblemGenerate}>
                    문제 생성
                  </Button>
                </Grid>
              </Grid>

              <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert severity="success" onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
                  저장되었습니다!
                </Alert>
              </Snackbar>
            </>
          )}

          {problemGenerated && (
            <>
              <Box sx={{ bgcolor: '#e8f0fe', borderRadius: 2, p: 3, boxShadow: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>생성된 문제 예시</Typography>
                <Typography variant="body1" color="text.secondary">
                  1. 다음 중 소프트웨어 개발 방법론에 해당하지 않는 것은?
                </Typography>
              </Box>

              <Grid container spacing={2} justifyContent="center" mb={4}>
                <Grid item>
                  <Button variant="outlined" color="secondary" onClick={() => alert('다운로드 기능은 아직 구현되지 않았습니다.')}>
                    다운로드
                  </Button>
                </Grid>
                <Grid item>
                <Button variant="contained" color="primary"
                  onClick={() => {
                    alert('문제가 저장되었습니다.');
                    navigate('/mypage'); // 원하는 경로로 이동
                  }}
                >
                  저장하기
                </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </>
  );
}

export default UploadPage;
