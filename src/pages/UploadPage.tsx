// src/pages/UploadPage.tsx
import React, { useState } from 'react'
import {
  Container,
  Button,
  Paper,
  TextField,
  Snackbar,
  Alert,
  Box,
  Typography,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Grid
} from '@mui/material'
import { CloudUpload } from '@mui/icons-material'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { aiSummaryAPI, aiQuestionAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

type MainTab = 'summary' | 'problem'
type SummaryPromptKey =
  | '내용 요약_기본 요약'
  | '내용 요약_핵심 요약'
  | '내용 요약_주제 요약'
  | '내용 요약_목차 요약'
  | '내용 요약_키워드 요약'

export default function UploadPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [mainTab, setMainTab] = useState<MainTab>('summary')
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const summaryPromptKeys: SummaryPromptKey[] = [
    '내용 요약_기본 요약',
    '내용 요약_핵심 요약',
    '내용 요약_주제 요약',
    '내용 요약_목차 요약',
    '내용 요약_키워드 요약'
  ]
  const summaryLabels = ['기본', '핵심', '주제', '목차', '키워드']
  const [sumTab, setSumTab] = useState(0)
  const [summaryType, setSummaryType] = useState(summaryPromptKeys[0])
  const [sumField, setSumField] = useState('언어')
  const [sumLevel, setSumLevel] = useState('고등')
  const [sumSentCount, setSumSentCount] = useState(3)

  const [summaryText, setSummaryText] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [openSumSnackbar, setOpenSumSnackbar] = useState(false)

  const questionPromptKeys = [
    '문제 생성_n지 선다형',
    '문제 생성_순서 배열형',
    '문제 생성_빈칸 채우기형',
    '문제 생성_참거짓형',
    '문제 생성_단답형',
    '문제 생성_서술형'
  ]
  const questionLabels = ['선다형', '순서 배열형', '빈칸 채우기형', '참거짓형', '단답형', '서술형']
  const [qTab, setQTab] = useState(0)
  const [qField, setQField] = useState('언어')
  const [qLevel, setQLevel] = useState('고등')
  const [qCount, setQCount] = useState(3)
  const [optCount, setOptCount] = useState(4)
  const [blankCount, setBlankCount] = useState(1)

  const [questionText, setQuestionText] = useState<string>('')
  const [questionLoading, setQuestionLoading] = useState(false)
  const [openQSnackbar, setOpenQSnackbar] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setFileName(f?.name ?? null)
  }

  const handleGenerateSummary = async () => {
    if (!file || !user) return alert('파일 선택 및 로그인 필요')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('summary_type', summaryType)
      fd.append('field', sumField)
      fd.append('level', sumLevel)
      fd.append('sentence_count', String(sumSentCount))
      const res = await aiSummaryAPI.generateSummary(fd)
      setSummaryText(res.data.summary)
      setOpenSumSnackbar(true)
    } catch (e: any) {
      console.error(e)
      alert(e.response?.data?.detail || '요약 오류')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSummary = () => alert('문서 요약이 저장되었습니다.')

  const handleGenerateQuestion = async () => {
    if (!summaryText || !user) return alert('먼저 요약을 생성해주세요')
    setQuestionLoading(true)
    try {
      const payload: any = {
        generation_type: questionPromptKeys[qTab],
        summary_text: summaryText,
        field: qField,
        level: qLevel,
        question_count: qCount
      }
      if (qTab === 0) payload.choice_count = optCount
      if (qTab === 1) payload.array_choice_count = optCount
      if (qTab === 2) payload.blank_count = blankCount
      const res = await aiQuestionAPI.generateQuestions(payload)
      setQuestionText(res.data.result)
      setOpenQSnackbar(true)
    } catch (e: any) {
      console.error(e)
      alert(e.response?.data?.detail || '문제 생성 오류')
    } finally {
      setQuestionLoading(false)
    }
  }

  const handleSaveQuestion = () => alert('생성된 문제가 저장되었습니다.')

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: '#f4f2f7', minHeight: '100vh', p: 4, pt: '100px' }}>
        <Container maxWidth="md">
          <Typography variant="h5" align="center" mb={3}>
            문서 업로드 및 {mainTab === 'summary' ? '요약' : '문제 생성'}
          </Typography>
          <Box mb={3} display="flex" justifyContent="center">
            <Button variant={mainTab === 'summary' ? 'contained' : 'text'} onClick={() => setMainTab('summary')} sx={{ mx: 1 }}>요약</Button>
            <Button variant={mainTab === 'problem' ? 'contained' : 'text'} onClick={() => setMainTab('problem')} sx={{ mx: 1 }}>문제 생성</Button>
          </Box>
          <Paper variant="outlined" sx={{ border: '2px dashed #ccc', p: 4, textAlign: 'center', mb: 4 }}>
            <CloudUpload sx={{ fontSize: 60, color: '#1976d2' }} />
            <Box mt={2}><Button component="label">파일 선택<input hidden type="file" onChange={handleFileUpload} /></Button></Box>
            {!fileName ? <Typography mt={2}>파일을 드래그하거나 선택하세요</Typography> : <Typography mt={2} fontWeight="bold">{fileName}</Typography>}
          </Paper>
          {mainTab === 'summary' ? (
            <>
              <Tabs value={sumTab} onChange={(_, v) => { setSumTab(v); setSummaryType(summaryPromptKeys[v]) }} variant="fullWidth" sx={{ mb: 2 }}>
                {summaryLabels.map((l, i) => <Tab key={i} label={l} />)}
              </Tabs>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={4}><FormControl fullWidth><InputLabel>분야</InputLabel><Select value={sumField} label="분야" onChange={e => setSumField(e.target.value)}>{['언어','과학','사회','경제','인문학','공학'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl></Grid>
                <Grid item xs={4}><FormControl fullWidth><InputLabel>난이도</InputLabel><Select value={sumLevel} label="난이도" onChange={e => setSumLevel(e.target.value)}>{['고등','대학'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl></Grid>
                <Grid item xs={4}><FormControl fullWidth><InputLabel>문장 수</InputLabel><Select value={sumSentCount} label="문장 수" onChange={e => setSumSentCount(Number(e.target.value))}>{[1,2,3,4,5].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}</Select></FormControl></Grid>
              </Grid>
              <Box textAlign="center" mb={2}><Button variant="contained" size="large" onClick={handleGenerateSummary} disabled={loading}>문서 요약 생성</Button></Box>
              {loading && <LinearProgress sx={{ mb: 2 }} />}
              {summaryText && <>
                <Box sx={{ bgcolor: '#fff', p: 3, boxShadow: 2, borderRadius: 2, mb: 2 }}><Typography variant="h6" gutterBottom>요약 결과</Typography><TextField fullWidth multiline minRows={8} value={summaryText} onChange={e => setSummaryText(e.target.value)} /></Box>
                <Box display="flex" justifyContent="center" gap={2} mb={4}><Button variant="outlined" onClick={handleSaveSummary}>문서 요약 저장</Button><Button variant="contained" onClick={() => setMainTab('problem')}>문제 생성으로 이동</Button></Box>
              </>}
            </>
          ) : (
            <>
              <Tabs value={qTab} onChange={(_, v) => setQTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
                {questionLabels.map((l, i) => <Tab key={i} label={l} />)}
              </Tabs>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={4}><FormControl fullWidth><InputLabel>분야</InputLabel><Select value={qField} label="분야" onChange={e => setQField(e.target.value)}>{['언어','과학','사회','경제','인문학','공학'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl></Grid>
                <Grid item xs={4}><FormControl fullWidth><InputLabel>난이도</InputLabel><Select value={qLevel} label="난이도" onChange={e => setQLevel(e.target.value)}>{['고등','대학'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl></Grid>
                <Grid item xs={4}><FormControl fullWidth><InputLabel>문제 수</InputLabel><Select value={qCount} label="문제 수" onChange={e => setQCount(Number(e.target.value))}>{[1,2,3,4,5].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}</Select></FormControl></Grid>
                {qTab === 0 && <Grid item xs={4}><FormControl fullWidth><InputLabel>보기 수</InputLabel><Select value={optCount} label="보기 수" onChange={e => setOptCount(Number(e.target.value))}>{[3,4,5].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}</Select></FormControl></Grid>}
                {qTab === 1 && <Grid item xs={4}><FormControl fullWidth><InputLabel>배열 개수</InputLabel><Select value={optCount} label="배열 개수" onChange={e => setOptCount(Number(e.target.value))}>{[3,4,5].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}</Select></FormControl></Grid>}
                {qTab === 2 && <Grid item xs={4}><FormControl fullWidth><InputLabel>빈칸 수</InputLabel><Select value={blankCount} label="빈칸 수" onChange={e => setBlankCount(Number(e.target.value))}>{[1,2,3].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}</Select></FormControl></Grid>}
              </Grid>
              <Box textAlign="center" mb={2}><Button variant="contained" onClick={handleGenerateQuestion} disabled={questionLoading}>문제 생성</Button></Box>
              {questionLoading && <LinearProgress sx={{ mb: 2 }} />}
              {questionText && <>
                <Paper sx={{ p: 3, mb: 2, borderRadius: 2, boxShadow: 2, bgcolor: '#e8f0fe' }}>
                  <Typography variant="h6" gutterBottom>생성된 문제</Typography>
                  <Typography style={{ whiteSpace: 'pre-wrap' }} color="text.secondary">{questionText}</Typography>
                </Paper>
                <Box display="flex" justifyContent="center" gap={2} mb={4}><Button variant="outlined" onClick={handleSaveQuestion}>문제 저장</Button></Box>
              </>}
            </>
          )}
          <Snackbar open={openSumSnackbar} autoHideDuration={3000} onClose={() => setOpenSumSnackbar(false)}><Alert severity="success">요약이 완료되었습니다!</Alert></Snackbar>
          <Snackbar open={openQSnackbar} autoHideDuration={3000} onClose={() => setOpenQSnackbar(false)}><Alert severity="success">문제 생성이 완료되었습니다!</Alert></Snackbar>
        </Container>
      </Box>
    </>
  )
}
