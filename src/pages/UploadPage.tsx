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
  Stack,
} from '@mui/material'
import { CloudUpload, Settings as SettingsIcon } from '@mui/icons-material'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { aiSummaryAPI, aiQuestionAPI, summaryAPI, questionAPI } from '../services/api'
import TuneIcon from '@mui/icons-material/Tune'
import SchoolIcon from '@mui/icons-material/School'
import { 
   Card, Avatar,Chip
} from '@mui/material';
import { 
   CheckCircle, Description 
} from '@mui/icons-material';
import ListAltIcon from '@mui/icons-material/ListAlt'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import SubjectIcon from '@mui/icons-material/Subject'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ShortTextIcon from '@mui/icons-material/ShortText'
import DescriptionIcon from '@mui/icons-material/Description'
type MainTab = 'summary' | 'problem'

type AiSummaryPromptKey =
  | '내용 요약_기본 요약'
  | '내용 요약_핵심 요약'
  | '내용 요약_주제 요약'
  | '내용 요약_목차 요약'
  | '내용 요약_키워드 요약'
const summaryLabels = ['기본', '핵심', '주제', '목차', '키워드']
const aiSummaryPromptKeys: AiSummaryPromptKey[] = [
  '내용 요약_기본 요약',
  '내용 요약_핵심 요약',
  '내용 요약_주제 요약',
  '내용 요약_목차 요약',
  '내용 요약_키워드 요약',
]
type DbSummaryPromptKey_Korean =
  | '기본 요약'
  | '핵심 요약'
  | '주제 요약'
  | '목차 요약'
  | '키워드 요약'
const dbSummaryPromptKeys_Korean: DbSummaryPromptKey_Korean[] = [
  '기본 요약',
  '핵심 요약',
  '주제 요약',
  '목차 요약',
  '키워드 요약',
]

type AiQuestionPromptKey_Korean =
  | 'n지 선다형'
  | '순서 배열형'
  | '빈칸 채우기형'
  | '참/거짓형'
  | '단답형'
  | '서술형'
const questionLabels = [
  'n지 선다형',
  '순서 배열형',
  '빈칸 채우기형',
  '참/거짓형',
  '단답형',
  '서술형',
]
const aiQuestionPromptKeys_Korean: AiQuestionPromptKey_Korean[] = [
  'n지 선다형',
  '순서 배열형',
  '빈칸 채우기형',
  '참/거짓형',
  '단답형',
  '서술형',
]

export default function UploadPage() {
  const { user } = useAuth()

  // common state
  const [mainTab, setMainTab] = useState<MainTab>('summary')
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  // summary state
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

  // problem state
  const [qTab, setQTab] = useState(0)
  const [qField, setQField] = useState('언어')
  const [qLevel, setQLevel] = useState('고등')
  const [qCount, setQCount] = useState(3)
  const [optCount, setOptCount] = useState(4)
  const [blankCount, setBlankCount] = useState(1)
  const [questionText, setQuestionText] = useState('')
  const [loadingQ, setLoadingQ] = useState(false)
  const [openQSnackbar, setOpenQSnackbar] = useState(false)

  // handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setFileName(f?.name ?? null)
  }

  const handleGenerateSummary = async () => {
    if (!file || !user) return alert('파일 선택 및 로그인 필요')
    setLoadingSum(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('summary_type', aiSummaryType)
      fd.append('field', sumField)
      fd.append('level', sumLevel)
      fd.append('sentence_count', String(sumSentCount))
      const res = await aiSummaryAPI.generateSummary(fd)
      setSummaryText(res.data.summary)
    } catch (e: any) {
      console.error(e)
      alert(e.response?.data?.detail || '요약 생성 오류')
    } finally {
      setLoadingSum(false)
    }
  }

  const handleSaveSummary = async () => {
    if (!user || !fileName) return
    try {
      await summaryAPI.saveSummary({
        userId: user.id,
        fileName,
        summaryType: dbSummaryTypeKorean,
        summaryText,
      })
      setOpenSumSnackbar(true)
    } catch (e) {
      console.error(e)
      alert('요약 저장 중 오류')
    }
  }

  const handleGenerateQuestion = async () => {
    if (!summaryText || !user) return alert('요약 후 문제 생성을 눌러주세요')
    setLoadingQ(true)
    try {
      const payload: any = {
        generation_type: `문제 생성_${aiQuestionPromptKeys_Korean[qTab]}`,
        summary_text: summaryText,
        field: qField,
        level: qLevel,
        question_count: qCount,
      }
      if (qTab === 0) payload.choice_count = optCount
      if (qTab === 1) payload.array_choice_count = optCount
      if (qTab === 2) payload.blank_count = blankCount
      const res = await aiQuestionAPI.generateQuestions(payload)
      setQuestionText(res.data.result)
    } catch (e: any) {
      console.error(e)
      alert(e.response?.data?.detail || '문제 생성 오류')
    } finally {
      setLoadingQ(false)
    }
  }

  const handleSaveQuestion = async () => {
    if (!user || !fileName) return
    try {
      await questionAPI.saveQuestion({
        userId: user.id,
        fileName,
        questionType: aiQuestionPromptKeys_Korean[qTab],
        questionText,
      })
      setOpenQSnackbar(true)
    } catch (e) {
      console.error(e)
      alert('문제 저장 중 오류')
    }
  }

  return (
    <>
      <Header />

      <Box
        sx={{
          minHeight: '100vh',
          p: 4,
          pt: '100px',
          background: theme =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(145deg, #ffffff 0%, #f4f7fa 100%)'
              : 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h5" align="center" mb={3}>
            문서 업로드 및 {mainTab === 'summary' ? '요약' : '문제 생성'}
          </Typography>

          {/* Upload Box */}
          <Box
            component="label"
            sx={{
              display: 'block',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
              mb: 4,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1565c0' }
                }}
              >
                <CloudUpload sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" gutterBottom>
                  파일 선택
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  여기를 클릭하거나 파일을 드래그하세요
                </Typography>
              </Box>
              {fileName && (
                <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" fontWeight="medium">
                    📄 {fileName}
                  </Typography>
                </Paper>
              )}
            </Stack>
            <input
              hidden
              type="file"
              onChange={handleFileUpload}
            />
          </Box>

          {/* Main Tabs */}
          <Box mb={5} display="flex" justifyContent="center">
            <Tabs
              value={mainTab}
              onChange={(_, v) => setMainTab(v)}
              sx={{
                minHeight: 48,
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.300',
                boxShadow: 1,
                '& .MuiTabs-indicator': {
                  height: '100%',
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                  zIndex: 0,
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  zIndex: 1,
                  color: 'text.secondary',
                  '&.Mui-selected': { color: 'white' },
                },
              }}
            >
              <Tab label="요약 생성" value="summary" sx={{ minWidth: 120 }} />
              <Tab label="문제 생성" value="problem" sx={{ minWidth: 120 }} />
            </Tabs>
          </Box>

          {mainTab === 'summary' ? (
            <>
              {/* Summary subtype Tabs */}
              <Box
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Tabs
                  value={sumTab}
                  onChange={(_, v) => {
                    setSumTab(v)
                    setAiSummaryType(aiSummaryPromptKeys[v])
                    setDbSummaryTypeKorean(dbSummaryPromptKeys_Korean[v])
                  }}
                  variant="fullWidth"
                  TabIndicatorProps={{ style: { display: 'none' } }}
                  sx={{ '& .MuiTabs-flexContainer': { gap: 0.5, p: 1 } }}
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
                        minHeight: 48,
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          fontWeight: 600,
                          transform: 'translateY(-1px)',
                          boxShadow: 1,
                        },
                        '&:hover': {
                          bgcolor: theme =>
                            theme.palette.mode === 'light'
                              ? 'primary.light'
                              : 'primary.dark',
                          color: 'primary.contrastText',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    />
                  ))}
                </Tabs>
              </Box>

              {/* Summary Options */}
              <Box
                sx={{
                  background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: 3,
                  p: 3,
                  mb: 3,
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  boxShadow:
                    '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2.5,
                    color: '#1e293b',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <TuneIcon sx={{ color: '#6366f1' }} />
                  요약 설정
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {/* 분야 */}
                  <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 16px)' } }}>
                    <Box sx={{ position: 'relative' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, color: '#475569', fontWeight: 500 }}
                      >
                        분야
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={sumField}
                          onChange={e => setSumField(e.target.value)}
                          displayEmpty
                          sx={{
                            borderRadius: 2,
                            backgroundColor: '#ffffff',
                            border: '2px solid transparent',
                            '&:hover': {
                              borderColor: '#6366f1',
                              backgroundColor: '#fefefe',
                            },
                            '&.Mui-focused': {
                              borderColor: '#6366f1',
                              boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          }}
                        >
                          {['언어', '과학', '사회', '경제', '인문학', '공학'].map(option => (
                            <MenuItem
                              key={option}
                              value={option}
                              sx={{
                                '&:hover': { backgroundColor: '#f1f5f9' },
                                '&.Mui-selected': {
                                  backgroundColor: '#e0e7ff',
                                  '&:hover': { backgroundColor: '#c7d2fe' },
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                                {option}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  {/* 난이도 */}
                  <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 16px)' } }}>
                    <Box sx={{ position: 'relative' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, color: '#475569', fontWeight: 500 }}
                      >
                        난이도
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={sumLevel}
                          onChange={e => setSumLevel(e.target.value)}
                          displayEmpty
                          sx={{
                            borderRadius: 2,
                            backgroundColor: '#ffffff',
                            border: '2px solid transparent',
                            '&:hover': {
                              borderColor: '#10b981',
                              backgroundColor: '#fefefe',
                            },
                            '&.Mui-focused': {
                              borderColor: '#10b981',
                              boxShadow: '0 0 0 3px rgba(16,185,129,0.1)',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          }}
                        >
                          {[
                            { value: '고등', icon: '📚' },
                            { value: '대학', icon: '🎓' },
                          ].map(({ value, icon }) => (
                            <MenuItem
                              key={value}
                              value={value}
                              sx={{
                                '&:hover': { backgroundColor: '#f0fdf4' },
                                '&.Mui-selected': {
                                  backgroundColor: '#dcfce7',
                                  '&:hover': { backgroundColor: '#bbf7d0' },
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span style={{ fontSize: '16px' }}>{icon}</span>
                                {value}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  {/* 문장 수 */}
                  <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 16px)' } }}>
                    <Box sx={{ position: 'relative' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, color: '#475569', fontWeight: 500 }}
                      >
                        문장 수
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={sumSentCount}
                          onChange={e => setSumSentCount(Number(e.target.value))}
                          displayEmpty
                          sx={{
                            borderRadius: 2,
                            backgroundColor: '#ffffff',
                            border: '2px solid transparent',
                            '&:hover': {
                              borderColor: '#f59e0b',
                              backgroundColor: '#fefefe',
                            },
                            '&.Mui-focused': {
                              borderColor: '#f59e0b',
                              boxShadow: '0 0 0 3px rgba(245,158,11,0.1)',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          }}
                        >
                          {[1, 2, 3, 4, 5].map(n => (
                            <MenuItem
                              key={n}
                              value={n}
                              sx={{
                                '&:hover': { backgroundColor: '#fffbeb' },
                                '&.Mui-selected': {
                                  backgroundColor: '#fef3c7',
                                  '&:hover': { backgroundColor: '#fde68a' },
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    backgroundColor: '#f59e0b',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {n}
                                </Box>
                                {n}개
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Box>

                {/* Optional: Summary Preview Card */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: 'rgba(99,102,241,0.05)',
                    borderRadius: 2,
                    border: '1px dashed rgba(99,102,241,0.2)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 500 }}>
                    설정 미리보기: {sumField} 분야의 {sumLevel}학교 수준으로 {sumSentCount}개 문장 요약
                  </Typography>
                </Box>
              </Box>

              {/* Generate Summary */}
              <Stack direction="row" justifyContent="center" sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerateSummary}
                  disabled={loadingSum}
                  size="large"
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    background: theme =>
                      theme.palette.mode === 'light'
                        ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                        : 'linear-gradient(45deg, #1565C0 30%, #0277BD 90%)',
                  }}
                >
                  ✨ 요약 생성
                </Button>
              </Stack>
              {loadingSum && <LinearProgress sx={{ mb: 3, height: 6, borderRadius: 1 }} />}

              {/* Summary Result */}
              {summaryText && (
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    mb: 3,
                    borderRadius: 3,
                    background: theme =>
                      theme.palette.mode === 'light'
                        ? 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
                        : 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
                  }}
                >
                  <Stack spacing={3}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        pb: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: 'success.main',
                          color: 'success.contrastText',
                        }}
                      >
                        📄
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        요약 결과
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      minRows={8}
                      value={summaryText}
                      onChange={e => setSummaryText(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <Stack direction="row" justifyContent="center" spacing={2} sx={{ pt: 1 }}>
                      <Button variant="outlined" onClick={handleSaveSummary} sx={{ borderRadius: 2.5, px: 3 }}>
                        💾 요약 저장
                      </Button>
                      <Button variant="contained" onClick={() => setMainTab('problem')} sx={{ borderRadius: 2.5, px: 3 }}>
                        🎯 문제 생성
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              )}

              <Snackbar
                open={openSumSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSumSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                   요약이 저장되었습니다!
                </Alert>
              </Snackbar>
            </>
          ) : (
            <>
              {/* Problem Tabs */}
              <Box
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Tabs
                  value={qTab}
                  onChange={(_, v) => setQTab(v)}
                  variant="fullWidth"
                  TabIndicatorProps={{ style: { display: 'none' } }}
                  sx={{ '& .MuiTabs-flexContainer': { gap: 0.5, p: 1 } }}
                >
                  {questionLabels.map((label, idx) => (
                    <Tab
                      key={idx}
                      label={label}
                      sx={{
                        textTransform: 'none',
                        color: 'text.secondary',
                        bgcolor: 'transparent',
                        borderRadius: 2,
                        minHeight: 48,
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          fontWeight: 600,
                          transform: 'translateY(-1px)',
                          boxShadow: 1,
                        },
                        '&:hover': {
                          bgcolor: theme =>
                            theme.palette.mode === 'light'
                              ? 'primary.light'
                              : 'primary.dark',
                          color: 'primary.contrastText',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    />
                  ))}
                </Tabs>
              </Box>

              {/* Problem Options */}
              <Box
                sx={{
                  background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: 3,
                  p: 3,
                  mb: 3,
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  boxShadow:
                    '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2.5, color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <SettingsIcon sx={{ color: '#6366f1' }} /> 문제 설정
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {/* 분야 */}
                  <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 16px)' } }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#475569', fontWeight: 500 }}>
                      분야
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={qField}
                        onChange={e => setQField(e.target.value)}
                        displayEmpty
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                          border: '2px solid transparent',
                          '&:hover': { borderColor: '#6366f1', backgroundColor: '#fefefe' },
                          '&.Mui-focused': { borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99,102,241,0.1)' },
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                      >
                        {['언어','과학','사회','경제','인문학','공학'].map(o => (
                          <MenuItem key={o} value={o} sx={{ '&:hover': { backgroundColor: '#f1f5f9' }, '&.Mui-selected': { backgroundColor: '#e0e7ff', '&:hover': { backgroundColor: '#c7d2fe' } } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <SchoolIcon sx={{ fontSize: 18, color: '#6366f1' }} /> {o}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* 난이도 */}
                  <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 16px)' } }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#475569', fontWeight: 500 }}>
                      난이도
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={qLevel}
                        onChange={e => setQLevel(e.target.value)}
                        displayEmpty
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                          border: '2px solid transparent',
                          '&:hover': { borderColor: '#10b981', backgroundColor: '#fefefe' },
                          '&.Mui-focused': { borderColor: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.1)' },
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                      >
                        {[{ value: '고등', icon: '📚' }, { value: '대학', icon: '🎓' }].map(({ value, icon }) => (
                          <MenuItem key={value} value={value} sx={{ '&:hover': { backgroundColor: '#f0fdf4' }, '&.Mui-selected': { backgroundColor: '#dcfce7', '&:hover': { backgroundColor: '#bbf7d0' } } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span style={{ fontSize: '16px' }}>{icon}</span> {value}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* 문제 수 */}
                  <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 16px)' } }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#475569', fontWeight: 500 }}>
                      문제 수
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={qCount}
                        onChange={e => setQCount(Number(e.target.value))}
                        displayEmpty
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                          border: '2px solid transparent',
                          '&:hover': { borderColor: '#f59e0b', backgroundColor: '#fefefe' },
                          '&.Mui-focused': { borderColor: '#f59e0b', boxShadow: '0 0 0 3px rgba(245,158,11,0.1)' },
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                      >
                        {[1,2,3,4,5].map(n => (
                          <MenuItem key={n} value={n} sx={{ '&:hover': { backgroundColor: '#fffbeb' }, '&.Mui-selected': { backgroundColor: '#fef3c7', '&:hover': { backgroundColor: '#fde68a' } } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', backgroundColor: '#f59e0b', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>{n}</Box>
                              {n}개
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* 보기 수 (n지선다) */}
                  {qTab === 0 && (
                    <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 16px)' } }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5, color: '#475569', fontWeight: 500 }}>
                        <FormatListNumberedIcon sx={{ fontSize: 18, color: '#f59e0b' }} /> 보기 수
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={optCount}
                          onChange={e => setOptCount(Number(e.target.value))}
                          displayEmpty
                          sx={{
                            borderRadius: 2, backgroundColor: '#ffffff', border: '2px solid transparent', '&:hover': { borderColor: '#f59e0b', backgroundColor: '#fefefe' }, '&.Mui-focused': { borderColor: '#f59e0b', boxShadow: '0 0 0 3px rgba(245,158,11,0.1)' }, '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          }}
                        >
                          {[2, 3, 4, 5].map(n => (
                            <MenuItem key={n} value={n} sx={{ '&:hover': { backgroundColor: '#fffbeb' }, '&.Mui-selected': { backgroundColor: '#fef3c7', '&:hover': { backgroundColor: '#fde68a' } } }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', backgroundColor: '#f59e0b', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>{n}</Box>
                                {n}개
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  )}

                {qTab === 2 && (
                  <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 16px)' } }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: '#475569',
                        fontWeight: 500,
                      }}
                    >
                      <ShortTextIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                      빈칸 수
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={blankCount}
                        onChange={e => setBlankCount(Number(e.target.value))}
                        displayEmpty
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                          border: '2px solid transparent',
                          '&:hover': { borderColor: '#f59e0b', backgroundColor: '#fefefe' },
                          '&.Mui-focused': {
                            borderColor: '#f59e0b',
                            boxShadow: '0 0 0 3px rgba(245,158,11,0.1)',
                          },
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                      >
                        {[1, 2, 3].map(n => (
                          <MenuItem
                            key={n}
                            value={n}
                            sx={{
                              '&:hover': { backgroundColor: '#fffbeb' },
                              '&.Mui-selected': {
                                backgroundColor: '#fef3c7',
                                '&:hover': { backgroundColor: '#fde68a' },
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  backgroundColor: '#f59e0b',
                                  color: 'white',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                }}
                              >
                                {n}
                              </Box>
                              {n}개
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
                </Box>
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: 'rgba(99,102,241,0.05)',
                    borderRadius: 2,
                    border: '1px dashed rgba(99,102,241,0.2)',
                    mb: 3,
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 500 }}>
                    설정 미리보기: {qField} 분야의 {qLevel} 수준으로 {qCount}문제
                    {qTab === 0 && `, 보기 ${optCount}개`}
                    {qTab === 2 && `, 빈칸 ${blankCount}개`}
                  </Typography>
                </Box>
              </Box>


              {/* Generate Question */}
              <Box textAlign="center" mb={2}>
                <Button
                  variant="contained"
                  onClick={handleGenerateQuestion}
                  disabled={loadingQ}
                  sx={{ borderRadius: 2.5, px: 4, py: 1.5, fontWeight: 600 }}
                >
                  ✏️ 문제 생성
                </Button>
              </Box>
              {loadingQ && <LinearProgress sx={{ mb: 2 }} />}

              {/* Question Result */}
              {questionText && (
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    mb: 3,
                    borderRadius: 3,
                    background: theme =>
                      theme.palette.mode === 'light'
                        ? 'linear-gradient(145deg, #e8f0fe 0%, #f0f4ff 100%)'
                        : 'linear-gradient(145deg, #2d3440 0%, #1a1f2a 100%)',
                  }}
                >
                  <Stack spacing={3}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        pb: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: 'info.main',
                          color: 'info.contrastText',
                        }}
                      >
                        📝
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        생성된 문제
                      </Typography>
                    </Box>
                    <Typography style={{ whiteSpace: 'pre-wrap' }} color="text.secondary">
                      {questionText}
                    </Typography>
                    <Stack direction="row" justifyContent="center" spacing={2}>
                      <Button variant="outlined" onClick={handleSaveQuestion} sx={{ borderRadius: 2.5, px: 3 }}>
                        💾 문제 저장
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              )}

              <Snackbar open={openQSnackbar} autoHideDuration={3000} onClose={() => setOpenQSnackbar(false)}>
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                   문제가 저장되었습니다!
                </Alert>
              </Snackbar>
            </>
          )}
        </Container>
      </Box>
    </>
  )
}
