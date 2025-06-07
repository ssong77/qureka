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
import { aiSummaryAPI, aiQuestionAPI, summaryAPI, questionAPI } from '../services/api'

type MainTab = 'summary' | 'problem'

//
// ─── 요약 탭용 “AI 호출(한글 프롬프트)” + “DB 저장(한글 ENUM)” 병렬 관리 ─────────────────────────────
//

// FastAPI(`aiSummaryAPI`)로 보낼 한글 프롬프트 키
type AiSummaryPromptKey =
  | '내용 요약_기본 요약'
  | '내용 요약_핵심 요약'
  | '내용 요약_주제 요약'
  | '내용 요약_목차 요약'
  | '내용 요약_키워드 요약'

// UI에 탭으로 보여줄 한글 라벨
const summaryLabels = ['기본', '핵심', '주제', '목차', '키워드']

// FastAPI에게 넘길 “한글 프롬프트” 배열
const aiSummaryPromptKeys: AiSummaryPromptKey[] = [
  '내용 요약_기본 요약',
  '내용 요약_핵심 요약',
  '내용 요약_주제 요약',
  '내용 요약_목차 요약',
  '내용 요약_키워드 요약'
]

// ────────────────────────────────────────────────────────────────────────────────────
// Node.js 백엔드(DB)에 저장할 때 넘길 “한글 요약 타입”(예: '기본 요약','핵심 요약'…)
//   → backend 모델(`Summary.create`) 안에서 내부적으로 영어 코드로 매핑됩니다.
// ────────────────────────────────────────────────────────────────────────────────────

type DbSummaryPromptKey_Korean =
  | '기본 요약'
  | '핵심 요약'
  | '주제 요약'
  | '목차 요약'
  | '키워드 요약'

// “DB 저장 시( summaryAPI.saveSummary )에 넘길 한글 ENUM” 배열
const dbSummaryPromptKeys_Korean: DbSummaryPromptKey_Korean[] = [
  '기본 요약',
  '핵심 요약',
  '주제 요약',
  '목차 요약',
  '키워드 요약'
]

//
// ─── 문제 생성 탭용 “AI 호출(한국어)” + “DB 저장(영어 코드)” ───────────────────────────────────
//

// FastAPI로 보낼 “한국어” 키 문자열 (get_question_prompt에서 이 값을 그대로 구분)
type AiQuestionPromptKey_Korean =
  | 'n지 선다형'
  | '순서 배열형'
  | '빈칸 채우기형'
  | '참/거짓형'
  | '단답형'
  | '서술형'

// UI 탭 라벨 (한국어 그대로)
const questionLabels = [
  'n지 선다형',
  '순서 배열형',
  '빈칸 채우기형',
  '참/거짓형',
  '단답형',
  '서술형'
]

// FastAPI에게 넘길 “한국어” 배열
const aiQuestionPromptKeys_Korean: AiQuestionPromptKey_Korean[] = [
  'n지 선다형',
  '순서 배열형',
  '빈칸 채우기형',
  '참/거짓형',
  '단답형',
  '서술형'
]

// DB 저장 시(questionAPI.saveQuestion)에는 영어 코드를 사용
type DbQuestionPromptKey_English =
  | 'multiple_choice'
  | 'sequence'
  | 'fill_in_the_blank'
  | 'true_false'
  | 'short_answer'
  | 'descriptive'

const dbQuestionPromptKeys_English: DbQuestionPromptKey_English[] = [
  'multiple_choice',
  'sequence',
  'fill_in_the_blank',
  'true_false',
  'short_answer',
  'descriptive'
]

export default function UploadPage() {
  const { user } = useAuth()

  // ── 공통 상태 ────────────────────────────────────────────────────────
  const [mainTab, setMainTab] = useState<MainTab>('summary')
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  // ── summary 탭용 상태 ─────────────────────────────────────────────────
  // sumTab 인덱스를 누르면
  //   • aiSummaryPromptKeys[sumTab]을 FastAPI로 보내고
  //   • dbSummaryPromptKeys_Korean[sumTab]을 “DB 저장 시 한글 타입”으로 넘깁니다.
  const [sumTab, setSumTab] = useState(0)
  const [aiSummaryType, setAiSummaryType] = useState<AiSummaryPromptKey>(
    aiSummaryPromptKeys[0]
  )
  const [dbSummaryTypeKorean, setDbSummaryTypeKorean] = useState<DbSummaryPromptKey_Korean>(
    dbSummaryPromptKeys_Korean[0]
  )

  const [sumField, setSumField] = useState('언어')
  const [sumLevel, setSumLevel] = useState('고등')
  const [sumSentCount, setSumSentCount] = useState(3)
  const [summaryText, setSummaryText] = useState('')
  const [loadingSum, setLoadingSum] = useState(false)
  const [openSumSnackbar, setOpenSumSnackbar] = useState(false)

  // ── problem 탭용 상태 ─────────────────────────────────────────────────
  // qTab 인덱스를 누르면
  //   • aiQuestionPromptKeys_Korean[qTab]을 FastAPI로 보내고
  //   • dbQuestionPromptKeys_English[qTab]을 “DB 저장 시 영어 코드”로 넘깁니다.
  const [qTab, setQTab] = useState(0)
  const [qField, setQField] = useState('언어')
  const [qLevel, setQLevel] = useState('고등')
  const [qCount, setQCount] = useState(3)
  const [optCount, setOptCount] = useState(4)
  const [blankCount, setBlankCount] = useState(1)
  const [questionText, setQuestionText] = useState('')
  const [loadingQ, setLoadingQ] = useState(false)
  const [openQSnackbar, setOpenQSnackbar] = useState(false)

  // ── 파일 선택 핸들러 ───────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setFileName(f?.name ?? null)
  }

  // ── 요약 생성 핸들러( FastAPI 호출 ) ─────────────────────────────────────
  const handleGenerateSummary = async () => {
    if (!file || !user) {
      return alert('파일 선택 및 로그인 필요')
    }
    setLoadingSum(true)

    try {
      const fd = new FormData()
      fd.append('file', file)

      // ★ AI에게는 “한글 프롬프트”만 보내야 FastAPI 내부에서 정상 동작합니다.
      fd.append('summary_type', aiSummaryType)
      fd.append('field', sumField)
      fd.append('level', sumLevel)
      fd.append('sentence_count', String(sumSentCount))

      const res = await aiSummaryAPI.generateSummary(fd)
      setSummaryText(res.data.summary)
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.detail || '요약 생성 오류')
    } finally {
      setLoadingSum(false)
    }
  }

  // ── 요약 저장 핸들러( Node.js 백엔드 호출 ) ───────────────────────────────
  const handleSaveSummary = async () => {
    if (!user || !fileName) {
      return
    }

    try {
      // ★ “DB 저장”에는 한글 요약 타입(예: '기본 요약')만 넘깁니다.
      //    backend 모델(Summary.create) 내부에서 English-ENUM('basic','key_points',…)으로 매핑해 줍니다.
      await summaryAPI.saveSummary({
        userId: user.id,
        fileName,
        summaryType: dbSummaryTypeKorean,
        summaryText,
      })
      setOpenSumSnackbar(true)
    } catch (err) {
      console.error('saveSummary error:', err)
      alert('요약 저장 중 오류')
    }
  }

  // ── 문제 생성 핸들러( FastAPI 호출 ) ─────────────────────────────────────
  const handleGenerateQuestion = async () => {
    if (!summaryText || !user) {
      return alert('요약 후 문제 생성을 눌러주세요')
    }
    setLoadingQ(true)

    try {
      // AI에게 넘길 payload: aiQuestionPromptKeys_Korean[qTab] (한국어) + 나머지 필드들
      const payload: any = {
        generation_type: `문제 생성_${aiQuestionPromptKeys_Korean[qTab]}`,
        summary_text: summaryText,
        field: qField,
        level: qLevel,
        question_count: qCount,
      }

      if (qTab === 0) {
        payload.choice_count = optCount
      } else if (qTab === 1) {
        payload.array_choice_count = optCount
      } else if (qTab === 2) {
        payload.blank_count = blankCount
      }
      // qTab 3~5는 추가 파라미터 없이 “참/거짓형” 등 한국어로 보내면 FastAPI가 처리

      const res = await aiQuestionAPI.generateQuestions(payload)
      setQuestionText(res.data.result)
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.detail || '문제 생성 오류')
    } finally {
      setLoadingQ(false)
    }
  }

  // ── 문제 저장 핸들러( Node.js 백엔드 호출 ) ───────────────────────────────
  const handleSaveQuestion = async () => {
    if (!user || !fileName) {
      return
    }

    try {
      
      // ★ Node.js 백엔드는 한국어 타입을 받아 내부에서 영어코드로 매핑합니다.
      await questionAPI.saveQuestion({
        userId: user.id,
        fileName,
        questionType: aiQuestionPromptKeys_Korean[qTab],
        questionText,
      })
      setOpenQSnackbar(true)
    } catch (err) {
      console.error('saveQuestion error:', err)
      alert('문제 저장 중 오류')
    }
  }

  return (
    <>
      <Header />

      <Box sx={{ bgcolor: '#f4f2f7', minHeight: '100vh', p: 4, pt: '100px' }}>
        <Container maxWidth="md">
          <Typography variant="h5" align="center" mb={3}>
            문서 업로드 및 {mainTab === 'summary' ? '요약' : '문제 생성'}
          </Typography>

          {/* ── Upload Box ───────────────────────────────────────────────────── */}
          <Paper
            variant="outlined"
            sx={{ border: '2px dashed #ccc', p: 4, textAlign: 'center', mb: 4 }}
          >
            <CloudUpload sx={{ fontSize: 60, color: '#1976d2' }} />
            <Box mt={2}>
              <Button component="label">
                파일 선택
                <input hidden type="file" onChange={handleFileUpload} />
              </Button>
            </Box>
            {fileName ? (
              <Typography mt={2} fontWeight="bold">
                {fileName}
              </Typography>
            ) : (
              <Typography mt={2}>파일을 드래그하거나 선택하세요</Typography>
            )}
          </Paper>

          {/* ── Main Tab (요약 / 문제 생성) ─────────────────────────────────────── */}
          <Box mb={5} display="flex" justifyContent="center">
            <Button
              variant={mainTab === 'summary' ? 'contained' : 'text'}
              onClick={() => setMainTab('summary')}
              sx={{ mx: 3, minWidth: 120, height: 48 }}
            >
              요약 생성
            </Button>
            <Button
              variant={mainTab === 'problem' ? 'contained' : 'text'}
              onClick={() => setMainTab('problem')}
              sx={{ mx: 3, minWidth: 120, height: 48 }}
            >
              문제 생성
            </Button>
          </Box>

          {mainTab === 'summary' ? (
            <>
              {/* ── summary 세부탭 ──────────────────────────────────────────── */}
              <Box
                sx={{
                  mb: 6,
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                  boxShadow: 1
                }}
              >
                <Tabs
                  value={sumTab}
                  onChange={(_, v) => {
                    setSumTab(v)
                    // AI 호출용 한글 프롬프트
                    setAiSummaryType(aiSummaryPromptKeys[v])
                    // DB 저장용 한글 ENUM
                    setDbSummaryTypeKorean(dbSummaryPromptKeys_Korean[v])
                  }}
                  variant="fullWidth"
                  TabIndicatorProps={{ style: { display: 'none' } }}
                >
                  {summaryLabels.map((label, idx) => (
                    <Tab
                      key={idx}
                      label={label}
                      sx={{
                        textTransform: 'none',
                        color: 'text.secondary',
                        bgcolor: 'transparent',
                        borderRadius: 2,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          fontWeight: 'bold'
                        },
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText'
                        }
                      }}
                    />
                  ))}
                </Tabs>
              </Box>

              {/* ── summary 옵션 ──────────────────────────────────────────────── */}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>분야</InputLabel>
                    <Select
                      value={sumField}
                      label="분야"
                      onChange={e => setSumField(e.target.value)}
                    >
                      {['언어', '과학', '사회', '경제', '인문학', '공학'].map(o => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>난이도</InputLabel>
                    <Select
                      value={sumLevel}
                      label="난이도"
                      onChange={e => setSumLevel(e.target.value)}
                    >
                      {['고등', '대학'].map(o => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>문장 수</InputLabel>
                    <Select
                      value={sumSentCount}
                      label="문장 수"
                      onChange={e => setSumSentCount(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <MenuItem key={n} value={n}>
                          {n}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box textAlign="center" mb={2}>
                <Button
                  variant="contained"
                  onClick={handleGenerateSummary}
                  disabled={loadingSum}
                >
                  요약 생성
                </Button>
              </Box>
              {loadingSum && <LinearProgress sx={{ mb: 2 }} />}

              {summaryText && (
                <Paper sx={{ p: 3, mb: 2, borderRadius: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    요약 결과
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={8}
                    value={summaryText}
                    onChange={e => setSummaryText(e.target.value)}
                  />
                  <Box display="flex" justifyContent="center" gap={2} mt={2}>
                    <Button variant="outlined" onClick={handleSaveSummary}>
                      요약 저장
                    </Button>
                    <Button variant="contained" onClick={() => setMainTab('problem')}>
                      문제 생성
                    </Button>
                  </Box>
                </Paper>
              )}
            </>
          ) : (
            <>
              {/* ── problem 세부탭 ──────────────────────────────────────────── */}
              <Tabs
                value={qTab}
                onChange={(_, v) => setQTab(v)}
                variant="fullWidth"
                sx={{ mb: 6 }}
                TabIndicatorProps={{ style: { display: 'none' } }}
              >
                {questionLabels.map((label, idx) => (
                  <Tab
                    key={idx}
                    label={label}
                    sx={{
                      textTransform: 'none',
                      color: 'text.secondary',
                      bgcolor: 'transparent',
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 'bold'
                      },
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText'
                      }
                    }}
                  />
                ))}
              </Tabs>

              {/* ── problem 옵션 ─────────────────────────────────────────────── */}
              <Grid container spacing={2} mb={10}>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>분야</InputLabel>
                    <Select
                      value={qField}
                      label="분야"
                      onChange={e => setQField(e.target.value)}
                    >
                      {['언어', '과학', '사회', '경제', '인문학', '공학'].map(o => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>난이도</InputLabel>
                    <Select
                      value={qLevel}
                      label="난이도"
                      onChange={e => setQLevel(e.target.value)}
                    >
                      {['고등', '대학'].map(o => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>문제 수</InputLabel>
                    <Select
                      value={qCount}
                      label="문제 수"
                      onChange={e => setQCount(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <MenuItem key={n} value={n}>
                          {n}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {qTab === 0 && (
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>보기 수</InputLabel>
                      <Select
                        value={optCount}
                        label="보기 수"
                        onChange={e => setOptCount(Number(e.target.value))}
                      >
                        {[3, 4, 5].map(n => (
                          <MenuItem key={n} value={n}>
                            {n}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {qTab === 1 && (
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>배열 개수</InputLabel>
                      <Select
                        value={optCount}
                        label="배열 개수"
                        onChange={e => setOptCount(Number(e.target.value))}
                      >
                        {[3, 4, 5].map(n => (
                          <MenuItem key={n} value={n}>
                            {n}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {qTab === 2 && (
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>빈칸 수</InputLabel>
                      <Select
                        value={blankCount}
                        label="빈칸 수"
                        onChange={e => setBlankCount(Number(e.target.value))}
                      >
                        {[1, 2, 3].map(n => (
                          <MenuItem key={n} value={n}>
                            {n}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {/* qTab === 3(참/거짓형), 4(단답형), 5(서술형)은 추가 옵션 없음 */}
              </Grid>

              <Box textAlign="center" mb={2}>
                <Button
                  variant="contained"
                  onClick={handleGenerateQuestion}
                  disabled={loadingQ}
                >
                  문제 생성
                </Button>
              </Box>
              {loadingQ && <LinearProgress sx={{ mb: 2 }} />}

              {questionText && (
                <Paper
                  sx={{ p: 3, mb: 2, borderRadius: 2, boxShadow: 2, bgcolor: '#e8f0fe' }}
                >
                  <Typography variant="h6" gutterBottom>
                    생성된 문제
                  </Typography>
                  <Typography style={{ whiteSpace: 'pre-wrap' }} color="text.secondary">
                    {questionText}
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2} mt={2}>
                    <Button variant="outlined" onClick={handleSaveQuestion}>
                      문제 저장
                    </Button>
                  </Box>
                </Paper>
              )}
            </>
          )}

          {/* ── Snackbars ────────────────────────────────────────────────────── */}
          <Snackbar
            open={openSumSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSumSnackbar(false)}
          >
            <Alert severity="success">요약이 저장되었습니다!</Alert>
          </Snackbar>
          <Snackbar
            open={openQSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenQSnackbar(false)}
          >
            <Alert severity="success">문제가 저장되었습니다!</Alert>
          </Snackbar>
        </Container>
      </Box>
    </>
  )
}
