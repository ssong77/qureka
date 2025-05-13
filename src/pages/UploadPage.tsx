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
  const [mainTab, setMainTab] = useState<'summary' | 'problem'>('summary');
  const [subTab, setSubTab] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [summary, setSummary] = useState('');
  const [summaryGenerated, setSummaryGenerated] = useState(false);
  const [problemGenerated, setProblemGenerated] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const [choices, setChoices] = useState('');
  const [choiceType, setChoiceType] = useState('');
  const [sequenceCount, setSequenceCount] = useState('');
  const [blankCount, setBlankCount] = useState('');
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleSaveProblem = () => {
    alert('문제가 저장되었습니다.');
    navigate('/mypage');
  };

  const handleGenerateSummary = () => {
    setSummary('업로드한 문서를 요약한 내용입니다.\n여기서 사용자가 직접 수정할 수 있습니다.');
    setSummaryGenerated(true);
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

          {/* 탭 선택 (요약/문제 생성) */}
          <Box display="flex" justifyContent="center" mb={3}>
            <Box display="inline-flex" bgcolor="#e3f2fd" borderRadius="999px" p={0.5}>
              <Button variant={mainTab === 'summary' ? 'contained' : 'text'} onClick={() => setMainTab('summary')} sx={{ borderRadius: '999px', px: 4 }}>
                요약
              </Button>
              <Button variant={mainTab === 'problem' ? 'contained' : 'text'} onClick={() => setMainTab('problem')} sx={{ borderRadius: '999px', px: 4 }}>
                문제 생성
              </Button>
            </Box>
          </Box>

          {/* 요약 탭 */}
          {mainTab === 'summary' && (
            <>
              <Box sx={{ border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#fff', mb: 2, boxShadow: 1 }}>
                <Tabs value={subTab} onChange={(e, v) => setSubTab(v)} variant="fullWidth">
                  <Tab label="기본 요약" />
                  <Tab label="핵심 요약" />
                  <Tab label="주제 요약" />
                  <Tab label="목차 요약" />
                  <Tab label="키워드 요약" />
                </Tabs>
              </Box>
              <Box sx={{ mt: 5 }} /> {/* 간격 조정*/}
              <Grid container spacing={2} mb={4}>
                <Grid item>{renderSelect('분야', ['언어', '철학'])}</Grid>
                <Grid item>{renderSelect('난이도', ['고등', '대학'])}</Grid>
              </Grid>

              {!summaryGenerated ? (
                <Box textAlign="center" mb={4}>
                  <Button variant="contained" color="primary" size="large" onClick={handleGenerateSummary}>✦ 문서 요약</Button>
                </Box>
              ) : (
                <>
                  <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 3, boxShadow: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>문서 요약 결과</Typography>
                    <TextField multiline fullWidth minRows={10} value={summary} onChange={(e) => setSummary(e.target.value)} variant="outlined" />
                  </Box>
                  
                  <Grid container spacing={2} justifyContent="center" mb={4}>
                    <Grid item><Button variant="outlined" color="secondary" onClick={handleSaveSummary}>요약 내용 저장</Button></Grid>
                    <Grid item><Button variant="contained" color="primary" onClick={() => setMainTab('problem')}>문제 생성</Button></Grid>
                  </Grid>
                </>
              )}
            </>
          )}

          {/* 문제 생성 탭 */}
          {mainTab === 'problem' && (
            <>
              <Box sx={{ border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#fff', mb: 2, boxShadow: 1 }}>
                <Tabs value={subTab} onChange={(e, v) => setSubTab(v)} variant="fullWidth" scrollButtons="auto">
                  <Tab label="선다형" />
                  <Tab label="순서 배열형" />
                  <Tab label="빈칸 채우기형" />
                  <Tab label="참거짓형" />
                  <Tab label="단답형" />
                  <Tab label="서술형" />
                </Tabs>
              </Box>
              <Box sx={{ mt: 5 }} /> {/* 간격 조정*/}
              <Grid container spacing={2} mb={4}>
                <Grid item xs={12}>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    {subTab === 0 && <>
                      {renderSelect('분야', ['언어', '과학','사회','경제','인문학','종교','철학','공학'])}
                      {renderSelect('난이도', ['전공', '비전공'])}
                      {renderSelect('보기 수', ['4', '5'])}
                      {renderSelect('답변 형태', ['단답형', '문장형'])}
                    </>}
                    {subTab === 1 && <>
                      {renderSelect('배열 대상 개수', ['3', '4', '5'])}
                      {renderSelect('보기 설명 포함 여부', ['포함', '미포함'])}
                    </>}
                    {subTab === 2 && <>
                      {renderSelect('빈칸 수', ['1', '2', '3'])}
                      {renderSelect('단어 길이 제한', ['없음', '10자 이하'])}
                    </>}
                    {subTab === 3 && <>
                      {renderSelect('항목 수', ['3', '5', '10'])}
                      {renderSelect('설명 포함 여부', ['포함', '미포함'])}
                    </>}
                    {subTab === 4 && <>
                      {renderSelect('정답 글자 수', ['1단어', '2단어'])}
                      {renderSelect('힌트 제공', ['제공', '미제공'])}
                    </>}
                    {subTab === 5 && <>
                      {renderSelect('채점 기준 제공', ['포함', '미포함'])}
                      {renderSelect('답안 길이', ['100자', '200자'])}
                    </>}
                  </Box>
                </Grid>
              </Grid>

              <Box textAlign="center" mb={2}>
                <Button variant="contained" onClick={handleProblemGenerate}>문제 생성</Button>
              </Box>

              {problemGenerated && (
                <Box sx={{ bgcolor: '#e8f0fe', borderRadius: 2, p: 3, boxShadow: 2, mb: 4 }}>
                  <Typography variant="h6" gutterBottom>생성된 문제 예시</Typography>
                  <Typography variant="body1" color="text.secondary" mb={2}>
                  1. 다음 중 디자인 패턴의 정의로 가장 적절하지 않은 것은?
                  </Typography>
                  <Typography variant="body2">1. 자주 발생하는 문제에 대해 재사용 가능한 해법을 제공하는 설계 방법</Typography>
                  <Typography variant="body2">2. 하드웨어 동작을 최적화하기 위한 물리적 구조 설계</Typography>
                  <Typography variant="body2">3. 소프트웨어 설계 문제 해결을 위한 일반적인 해결 템플릿</Typography>
                  <Typography variant="body2">4. 객체 간 상호작용을 명시적으로 정의하는 설계 방식</Typography>
                  <Typography variant="body2" mt={2}><strong>정답:</strong> 2</Typography>
                  <Button variant="outlined" size="small" sx={{ my: 2 }} onClick={() => setShowAnswer(!showAnswer)}>
                    정답 보기
                  </Button>
                  {showAnswer && (
                    <Typography variant="body2" mt={2}>
                      <strong>정답:</strong> 2
                    </Typography>
                  )}
                  <Typography variant="body2"><strong>해설:</strong> 디자인 패턴은 소프트웨어 설계에서 반복적으로 발생하는 문제에 대한 해결책으로, 하드웨어 설계와는 관련이 없습니다.</Typography>
                  
                  <Grid container spacing={2} justifyContent="center" mt={2}>
                    <Grid item><Button variant="outlined" color="secondary">다운로드</Button></Grid>
                    <Grid item><Button variant="contained" color="primary" onClick={handleSaveProblem}>문제 저장</Button></Grid>
                  </Grid>
                </Box>
              )}
            </>
          )}

          <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert severity="success" onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
              저장되었습니다!
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </>
  );
}

export default UploadPage;
