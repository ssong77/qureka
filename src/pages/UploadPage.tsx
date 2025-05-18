// qureka/src/pages/UploadPage.tsx
import React, { useState } from 'react';
import {
  Container, Select, MenuItem,
  FormControl, InputLabel, Button, Tabs, Tab, Paper, TextField,
  Snackbar, Alert, Box, Typography, Grid
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import Header from '../components/Header';
import { summaryAPI, questionAPI, userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const [mainTab, setMainTab] = useState<'summary' | 'problem'>('summary');
  const [subTab, setSubTab] = useState(0);
  const [file, setFile] = useState<File|null>(null);
  const [fileName, setFileName] = useState<string|null>(null);

  // 요약 관련 상태
  const [summary, setSummary] = useState('');
  const [summaryGenerated, setSummaryGenerated] = useState(false);
  const [summaryId, setSummaryId] = useState<string>('');

  // 문제 생성 관련 상태
  const [problemGenerated, setProblemGenerated] = useState(false);
  const [problems, setProblems] = useState<any[]>([]);
  
  // 문제 세부설정 상태 (귀하가 쓰시는 대로 유지)
  const [choices, setChoices] = useState('');
  const [choiceType, setChoiceType] = useState('');
  const [sequenceCount, setSequenceCount] = useState('');
  const [blankCount, setBlankCount] = useState('');

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();

  // 파일 업로드 UI
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  // ① 문서 요약 API 호출
  const handleGenerateSummary = async () => {
    if (!file) return alert('파일을 먼저 선택하세요.');
    try {
      const res = await summaryAPI.uploadAndSummarize(file);
      // 백엔드가 반환하는 모델에 맞춰 아래 필드를 조정하세요.
      const { id, summary: text } = res.data;
      setSummaryId(id);
      setSummary(text);
      setSummaryGenerated(true);
      // 문제 탭으로 바로 전환 원하시면:
      // setMainTab('problem');
    } catch (err) {
      console.error(err);
      alert('요약 생성에 실패했습니다.');
    }
  };

  // ② 문제 생성 API 호출
  const handleProblemGenerate = async () => {
    if (!summaryGenerated) return alert('먼저 요약을 생성하세요.');
    try {
      const payload = {
        summaryId: summaryId,
        // 귀하가 원하시는 세부 파라미터를 그대로 넘기면 됩니다.
        question_count: Number(sequenceCount) || 3,
        choice_count: Number(choices)      || 4,
        answer_type: choiceType,          // 예시
        blank_count: Number(blankCount)   // 예시
      };
      const res = await questionAPI.generate(payload);
      setProblems(res.data.problems);
      setProblemGenerated(true);
      setOpenSnackbar(true);
    } catch (err) {
      console.error(err);
      alert('문제 생성에 실패했습니다.');
    }
  };

  // ③ 저장 버튼 (기존 동작 유지)
  const handleSaveProblem = () => {
    alert('문제가 저장되었습니다.');
    navigate('/mypage');
  };

  // 세부설정 셀렉트 렌더러 (원본 그대로)
  const renderSelect = (label: string, options: string[], state: string, setter: (v:string)=>void) => (
    <FormControl key={label} sx={{ minWidth: 120 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={state}
        label={label}
        onChange={e => setter(e.target.value)}
      >
        {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
      </Select>
    </FormControl>
  );

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: '#f4f7fb', minHeight: '100vh', px:2, py:4, pt:'100px' }}>
        <Container maxWidth="md">
          <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
            문서 업로드 및 요약
          </Typography>
          <Paper variant="outlined" sx={{ border:'2px dashed #ccc', p:4, textAlign:'center', mb:4 }}>
            <CloudUpload sx={{ fontSize:60, color:'#1976d2' }} />
            <Box mt={2}>
              <Button component="label" variant="contained">
                파일 선택
                <input hidden type="file" onChange={handleFileUpload} />
              </Button>
            </Box>
            {!fileName
              ? <Typography mt={2}>또는 파일을 여기로 끌어 놓으세요</Typography>
              : <Typography variant="h6" mt={2}>{fileName}</Typography>
            }
          </Paper>

          {/* 탭 */}
          <Box display="flex" justifyContent="center" mb={3}>
            <Box display="inline-flex" bgcolor="#e3f2fd" borderRadius="999px" p={0.5}>
              <Button
                variant={mainTab==='summary'?'contained':'text'}
                onClick={()=>setMainTab('summary')}
                sx={{ borderRadius:'999px', px:4 }}
              >
                요약
              </Button>
              <Button
                variant={mainTab==='problem'?'contained':'text'}
                onClick={()=>setMainTab('problem')}
                sx={{ borderRadius:'999px', px:4 }}
              >
                문제 생성
              </Button>
            </Box>
          </Box>

          {/* 요약 탭 */}
          {mainTab==='summary' && (
            <>
              <Box sx={{ border:'1px solid #ccc', borderRadius:2, mb:2, boxShadow:1 }}>
                <Tabs value={subTab} onChange={(e,v)=>setSubTab(v)} variant="fullWidth">
                  <Tab label="기본 요약" />
                  <Tab label="핵심 요약" />
                  <Tab label="주제 요약" />
                  <Tab label="목차 요약" />
                  <Tab label="키워드 요약" />
                </Tabs>
              </Box>
              <Box mt={3}>
                <Grid container spacing={2} mb={4}>
                  <Grid item>{renderSelect('분야', ['언어','철학'], '', () => {})}</Grid>
                  <Grid item>{renderSelect('난이도', ['고등','대학'], '', () => {})}</Grid>
                </Grid>
                {!summaryGenerated
                  ? <Box textAlign="center"><Button variant="contained" size="large" onClick={handleGenerateSummary}>✦ 문서 요약</Button></Box>
                  : (
                    <>
                      <Box sx={{ bgcolor:'#fff', p:3, borderRadius:2, boxShadow:2, mb:2 }}>
                        <Typography variant="h6" gutterBottom>문서 요약 결과</Typography>
                        <TextField
                          multiline fullWidth minRows={10}
                          value={summary}
                          onChange={e=>setSummary(e.target.value)}
                        />
                      </Box>
                      <Grid container spacing={2} justifyContent="center" mb={4}>
                        <Grid item><Button variant="outlined" onClick={()=>setOpenSnackbar(true)}>요약 저장</Button></Grid>
                        <Grid item><Button variant="contained" onClick={()=>setMainTab('problem')}>문제 생성</Button></Grid>
                      </Grid>
                    </>
                  )
                }
              </Box>
            </>
          )}

          {/* 문제 생성 탭 */}
          {mainTab==='problem' && (
            <>
              <Box sx={{ border:'1px solid #ccc', borderRadius:2, mb:2, boxShadow:1 }}>
                <Tabs value={subTab} onChange={(e,v)=>setSubTab(v)} variant="fullWidth" scrollButtons="auto">
                  <Tab label="선다형" />
                  <Tab label="순서 배열형" />
                  <Tab label="빈칸 채우기형" />
                  <Tab label="참/거짓형" />
                  <Tab label="단답형" />
                  <Tab label="서술형" />
                </Tabs>
              </Box>
              <Grid container spacing={2} mb={4}>
                <Grid item xs={12}>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    {subTab===0 && <>
                      {renderSelect('보기 수', ['4','5'], choices, setChoices)}
                      {renderSelect('답변 형태', ['단답형','문장형'], choiceType, setChoiceType)}
                    </>}
                    {subTab===1 && <>
                      {renderSelect('배열 개수', ['3','4','5'], sequenceCount, setSequenceCount)}
                    </>}
                    {subTab===2 && <>
                      {renderSelect('빈칸 수', ['1','2','3'], blankCount, setBlankCount)}
                    </>}
                    {/* 나머지 세부 탭도 동일하게 */}
                  </Box>
                </Grid>
              </Grid>
              <Box textAlign="center" mb={2}>
                <Button variant="contained" onClick={handleProblemGenerate}>문제 생성</Button>
              </Box>
              {problemGenerated && (
                <Box sx={{ bgcolor:'#e8f0fe', p:3, borderRadius:2, boxShadow:2, mb:4 }}>
                  {problems.map((p,i)=>
                    <Box key={i} mb={2}>
                      <Typography>{`${i+1}. ${p.question}`}</Typography>
                      {p.choices.map((c:string,j:number)=>
                        <Typography key={j} variant="body2">· {c}</Typography>
                      )}
                    </Box>
                  )}
                  <Box textAlign="center">
                    <Button variant="outlined" onClick={handleSaveProblem}>문제 저장</Button>
                  </Box>
                </Box>
              )}
            </>
          )}

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={()=>setOpenSnackbar(false)}
            anchorOrigin={{ vertical:'top', horizontal:'center' }}
          >
            <Alert severity="success" onClose={()=>setOpenSnackbar(false)} sx={{ width:'100%' }}>
              저장되었습니다!
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </>
  );
}
