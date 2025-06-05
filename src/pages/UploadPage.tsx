// 파일명: UploadPage_Flex.tsx

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
  Grid,
  Stack,
} from '@mui/material'
import {
  CloudUpload,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import {
  aiSummaryAPI,
  aiQuestionAPI,
  summaryAPI,
  questionAPI,
} from '../services/api'
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

type MainTab = 'summary' | 'problem'
type SummaryPromptKey =
  | '내용 요약_기본 요약'
  | '내용 요약_핵심 요약'
  | '내용 요약_주제 요약'
  | '내용 요약_목차 요약'
  | '내용 요약_키워드 요약'

export default function UploadPage() {
  const { user } = useAuth()
  const [mainTab, setMainTab] = useState<MainTab>('summary')
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  // ── summary 탭 관련 상태
  const summaryPromptKeys: SummaryPromptKey[] = [
    '내용 요약_기본 요약',
    '내용 요약_핵심 요약',
    '내용 요약_주제 요약',
    '내용 요약_목차 요약',
    '내용 요약_키워드 요약',
  ]
  const summaryLabels = ['기본', '핵심', '주제', '목차', '키워드']
  const [sumTab, setSumTab] = useState(0)
  const [summaryType, setSummaryType] = useState(summaryPromptKeys[0])
  const [sumField, setSumField] = useState('언어')
  const [sumLevel, setSumLevel] = useState('고등')
  const [sumSentCount, setSumSentCount] = useState(3)
  const [keywordCount, setKeywordCount] = useState(3)
  const [yourKeywordsArray, setYourKeywordsArray] = useState<string[]>([
    '키워드1',
    '키워드2',
    '키워드3',
  ])
  const [summaryText, setSummaryText] = useState('')
  const [loadingSum, setLoadingSum] = useState(false)
  const [openSumSnackbar, setOpenSumSnackbar] = useState(false)

  // ── problem 탭 관련 상태
  const questionPromptKeys = [
    '문제 생성_n지 선다형',
    '문제 생성_순서 배열형',
    '문제 생성_참거짓형',
    '문제 생성_빈칸 채우기형',
    '문제 생성_단답형',
    '문제 생성_서술형',
  ]
  const questionLabels = [
    '선다형',
    '순서 배열형',
    '빈칸 채우기형',
    '참거짓형',
    '단답형',
    '서술형',
  ]
  const [qTab, setQTab] = useState(0)
  const [qField, setQField] = useState('언어')
  const [qLevel, setQLevel] = useState('고등')
  const [qCount, setQCount] = useState(3)
  const [optCount, setOptCount] = useState(4)
  const [blankCount, setBlankCount] = useState(1)
  const [questionText, setQuestionText] = useState('')
  const [loadingQ, setLoadingQ] = useState(false)
  const [openQSnackbar, setOpenQSnackbar] = useState(false)

  // 파일 선택 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setFileName(f?.name ?? null)
  }

  // 요약 생성
  const handleGenerateSummary = async () => {
    if (!file || !user) {
      alert('파일 선택 및 로그인 필요')
      return
    }
    setLoadingSum(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('summary_type', summaryType)
      fd.append('domain', sumField)
      fd.append('summary_level', sumLevel)
      fd.append('char_limit', String(sumSentCount))
      fd.append('topic_count', String(keywordCount))
      fd.append('keyword_count', String(keywordCount))
      fd.append('keywords', yourKeywordsArray.join(','))

      const res = await aiSummaryAPI.generateSummary(fd)
      setSummaryText(res.data.summary)
    } catch (e: any) {
      console.error('요약 생성 중 서버 에러:', e.response?.data)
      alert(
        e.response?.data?.detail ||
          e.response?.data?.error ||
          '요약 생성 중 알 수 없는 오류가 발생했습니다.'
      )
    } finally {
      setLoadingSum(false)
    }
  }

  // 요약 저장
  const handleSaveSummary = async () => {
    if (!user || !fileName) return
    try {
      await summaryAPI.saveSummary({
        userId: user.id,
        fileName,
        summaryType: summaryLabels[sumTab] + ' 요약',
        summaryText,
      })
      setOpenSumSnackbar(true)
    } catch (e) {
      console.error('saveSummary error:', e)
      alert('요약 저장 중 오류')
    }
  }

  // 문제 생성
  const handleGenerateQuestion = async () => {
    if (!summaryText || !user) {
      return alert('요약 후 문제 생성을 눌러주세요')
    }
    setLoadingQ(true)
    try {
      const basePayload: any = {
        generation_type: questionPromptKeys[qTab],
        summary_text: summaryText,
        domain: qField,
        difficulty: qLevel,
        question_count: qCount,
        choice_count: null,
        choice_format: null,
        arry_choice_count: null,
        blank_count: null,
      }

      if (qTab === 0) {
        basePayload.choice_count = optCount
        basePayload.choice_format = '문장형'
      }
      if (qTab === 1) {
        basePayload.arry_choice_count = optCount
        basePayload.choice_format = '순서형'
      }
      if (qTab === 2) {
        basePayload.blank_count = blankCount
        basePayload.choice_format = '빈칸형'
      }

      const res = await aiQuestionAPI.generateQuestions(basePayload)
      setQuestionText(res.data.result)
    } catch (e: any) {
      console.error(e)
      const msg = e.response?.data?.detail?.[0]?.msg || '문제 생성 오류'
      alert(msg)
    } finally {
      setLoadingQ(false)
    }
  }

  // 문제 저장
  const handleSaveQuestion = async () => {
    if (!user || !fileName) return
    try {
      await questionAPI.saveQuestion({
        userId: user.id,
        fileName,
        questionType: questionLabels[qTab],
        questionText,
      })
      setOpenQSnackbar(true)
    } catch (e) {
      console.error('saveQuestion error:', e)
      alert('문제 저장 중 오류')
    }
  }

  return (
    <>
      <Header />

      <Box sx={{ bgcolor: 'background.paper', minHeight: '100vh', p: 4, pt: '100px' }}>
        <Container maxWidth="md">
          <Typography variant="h5" align="center" mb={3}>
            문서 업로드 및 {mainTab === 'summary' ? '요약 생성' : '문제 생성'}
          </Typography>

          {/* Upload Box */}
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

          {/* Main Tab */}
<Box mb={5} display="flex" justifyContent="center">
<Tabs 
  value={mainTab} 
  onChange={(event, newValue) => setMainTab(newValue)}
  sx={{ 
    minHeight: 48,
    backgroundColor: 'white',
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'grey.300',
    boxShadow: 1,
    '& .MuiTabs-indicator': {
      height: '100%',
      backgroundColor: 'primary.main',
      borderRadius: 2,
      zIndex: 0,
    },
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: 600,
      zIndex: 1,
      color: 'text.secondary',
      '&.Mui-selected': {
        color: 'white',
      }
    }
  }}
>
    <Tab label="요약 생성" value="summary" sx={{ minWidth: 120 }} />
    <Tab label="문제 생성" value="problem" sx={{ minWidth: 120 }} />
  </Tabs>
</Box>

          {mainTab === 'summary' ? (
            <>
              {/* ▼ 탭 섹션 - 요약 유형 선택 */}
              <Box
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                  boxShadow: theme => (theme.palette.mode === 'light' ? 2 : 4),
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Tabs
                  value={sumTab}
                  onChange={(_, v) => {
                    setSumTab(v)
                    setSummaryType(summaryPromptKeys[v])
                  }}
                  variant="fullWidth"
                  TabIndicatorProps={{ style: { display: 'none' } }}
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      gap: 0.5,
                      p: 1,
                    },
                  }}
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
                        transition: 'all 0.2s ease-in-out',
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

              {/* ▼ 옵션 선택 섹션 - 세부 설정 */}
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  mb: 4,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  background: theme =>
                    theme.palette.mode === 'light'
                      ? 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
                      : 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
                }}
              >
                <Stack spacing={3}>
                  {/* 헤더 */}
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
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <SettingsIcon fontSize="small" />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      설정 옵션
                    </Typography>
                  </Box>

                  {/* 옵션 컨트롤들 */}
                  <Stack spacing={3}>
                    {/* 첫 번째 행 - 분야와 난이도 */}
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 3,
                        flexWrap: 'wrap',
                        '& > *': {
                          flex: '1 1 240px',
                          minWidth: '200px',
                        },
                      }}
                    >
                      <FormControl variant="outlined">
                        <InputLabel
                          shrink
                          sx={{
                            bgcolor: 'background.paper',
                            px: 1.5,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                        >
                          📚 분야
                        </InputLabel>
                        <Select
                          value={sumField}
                          label="📚 분야"
                          onChange={e => setSumField(e.target.value)}
                          sx={{
                            borderRadius: 2.5,
                            '& .MuiOutlinedInput-root': {
                              transition: 'all 0.2s ease-in-out',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                                borderWidth: 2,
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                                borderWidth: 2,
                              },
                            },
                          }}
                        >
                          {['언어', '과학', '사회', '경제', '인문학', '공학'].map(
                            option => (
                              <MenuItem
                                key={option}
                                value={option}
                                sx={{
                                  borderRadius: 1.5,
                                  mx: 1,
                                  my: 0.5,
                                  transition: 'all 0.15s ease-in-out',
                                  '&:hover': {
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    transform: 'translateX(4px)',
                                  },
                                }}
                              >
                                {option}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>

                      <FormControl variant="outlined">
                        <InputLabel
                          shrink
                          sx={{
                            bgcolor: 'background.paper',
                            px: 1.5,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                        >
                          🎯 난이도
                        </InputLabel>
                        <Select
                          value={sumLevel}
                          label="🎯 난이도"
                          onChange={e => setSumLevel(e.target.value)}
                          sx={{
                            borderRadius: 2.5,
                            '& .MuiOutlinedInput-root': {
                              transition: 'all 0.2s ease-in-out',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                                borderWidth: 2,
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                                borderWidth: 2,
                              },
                            },
                          }}
                        >
                          {['고등', '대학'].map(option => (
                            <MenuItem
                              key={option}
                              value={option}
                              sx={{
                                borderRadius: 1.5,
                                mx: 1,
                                my: 0.5,
                                transition: 'all 0.15s ease-in-out',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'primary.contrastText',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    {/* 두 번째 행 - 문장 수와 키워드 개수 */}
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 3,
                        flexWrap: 'wrap',
                        '& > *': {
                          flex: '1 1 240px',
                          minWidth: '200px',
                        },
                      }}
                    >
                      <FormControl variant="outlined">
                        <InputLabel
                          shrink
                          sx={{
                            bgcolor: 'background.paper',
                            px: 1.5,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                        >
                          📝 문장 수
                        </InputLabel>
                        <Select
                          value={sumSentCount}
                          label="📝 문장 수"
                          onChange={e => setSumSentCount(Number(e.target.value))}
                          sx={{
                            borderRadius: 2.5,
                            '& .MuiOutlinedInput-root': {
                              transition: 'all 0.2s ease-in-out',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                                borderWidth: 2,
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                                borderWidth: 2,
                              },
                            },
                          }}
                        >
                          {[1, 2, 3, 4, 5].map(num => (
                            <MenuItem
                              key={num}
                              value={num}
                              sx={{
                                borderRadius: 1.5,
                                mx: 1,
                                my: 0.5,
                                transition: 'all 0.15s ease-in-out',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'primary.contrastText',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              {num}개
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl variant="outlined">
                        <InputLabel
                          shrink
                          sx={{
                            bgcolor: 'background.paper',
                            px: 1.5,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                        >
                          🔑 키워드 개수
                        </InputLabel>
                        <Select
                          value={keywordCount}
                          label="🔑 키워드 개수"
                          onChange={e => setKeywordCount(Number(e.target.value))}
                          sx={{
                            borderRadius: 2.5,
                            '& .MuiOutlinedInput-root': {
                              transition: 'all 0.2s ease-in-out',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                                borderWidth: 2,
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                                borderWidth: 2,
                              },
                            },
                          }}
                        >
                          {[1, 2, 3, 4, 5].map(num => (
                            <MenuItem
                              key={num}
                              value={num}
                              sx={{
                                borderRadius: 1.5,
                                mx: 1,
                                my: 0.5,
                                transition: 'all 0.15s ease-in-out',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'primary.contrastText',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              {num}개
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>

              {/* ▼ 요약 생성 버튼 */}
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
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: theme =>
                      theme.palette.mode === 'light'
                        ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                        : 'linear-gradient(45deg, #1565C0 30%, #0277BD 90%)',
                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  ✨ 요약 생성
                </Button>
              </Stack>

              {/* 로딩 인디케이터 */}
              {loadingSum && (
                <Box sx={{ mb: 3 }}>
                  <LinearProgress
                    sx={{
                      borderRadius: 1,
                      height: 6,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>
              )}

              {/* ▼ 요약 결과 */}
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
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack spacing={3}>
                    {/* 결과 헤더 */}
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
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        📄
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 600,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        요약 결과
                      </Typography>
                    </Box>

                    {/* 텍스트 필드 */}
                    <TextField
                      fullWidth
                      multiline
                      minRows={8}
                      value={summaryText}
                      onChange={e => setSummaryText(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: 'background.default',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />

                    {/* 액션 버튼들 */}
                    <Stack direction="row" justifyContent="center" spacing={2} sx={{ pt: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={handleSaveSummary}
                        sx={{
                          borderRadius: 2.5,
                          px: 3,
                          py: 1,
                          textTransform: 'none',
                          fontWeight: 500,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: 2,
                          },
                        }}
                      >
                        💾 요약 저장
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => setMainTab('problem')}
                        sx={{
                          borderRadius: 2.5,
                          px: 3,
                          py: 1,
                          textTransform: 'none',
                          fontWeight: 500,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: 4,
                          },
                        }}
                      >
                        🎯 문제 생성
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              )}

              {/* ▼ 저장 성공 메시지 */}
              <Snackbar
                open={openSumSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSumSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Alert
                  severity="success"
                  sx={{
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: '1.25rem',
                    },
                  }}
                >
                  ✅ 요약이 저장되었습니다!
                </Alert>
              </Snackbar>
            </>
          ) : (
            <>
              {/* ▼ 문제 생성 세부탭 */}
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
                      borderRadius: 2,
                      minHeight: 48,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease-in-out',
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 600,
                        transform: 'translateY(-1px)',
                        boxShadow: 1,
                      },
                      '&:hover': {
                        bgcolor: theme =>
                          theme.palette.mode === 'light' ? 'primary.light' : 'primary.dark',
                        color: 'primary.contrastText',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  />
                ))}
              </Tabs>

              {/* ▼ 문제 옵션 (Flexbox) */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 10 }}>
                <Box sx={{ flexBasis: '33.3333%' }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink sx={{ bgcolor: 'background.paper', px: 1 }}>
                      분야
                    </InputLabel>
                    <Select
                      value={qField}
                      label="분야"
                      onChange={e => setQField(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      {['언어', '과학', '사회', '경제', '인문학', '공학'].map(option => (
                        <MenuItem
                          key={option}
                          value={option}
                          sx={{
                            borderRadius: 1,
                            mx: 1,
                            my: 0.5,
                            '&:hover': {
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText',
                            },
                          }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flexBasis: '33.3333%' }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink sx={{ bgcolor: 'background.paper', px: 1 }}>
                      난이도
                    </InputLabel>
                    <Select
                      value={qLevel}
                      label="난이도"
                      onChange={e => setQLevel(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      {['고등', '대학'].map(option => (
                        <MenuItem
                          key={option}
                          value={option}
                          sx={{
                            borderRadius: 1,
                            mx: 1,
                            my: 0.5,
                            '&:hover': {
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText',
                            },
                          }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flexBasis: '33.3333%' }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink sx={{ bgcolor: 'background.paper', px: 1 }}>
                      문제 수
                    </InputLabel>
                    <Select
                      value={qCount}
                      label="문제 수"
                      onChange={e => setQCount(Number(e.target.value))}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <MenuItem
                          key={num}
                          value={num}
                          sx={{
                            borderRadius: 1,
                            mx: 1,
                            my: 0.5,
                            '&:hover': {
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText',
                            },
                          }}
                        >
                          {num}개
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {qTab === 0 && (
                  <Box sx={{ flexBasis: '33.3333%' }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink sx={{ bgcolor: 'background.paper', px: 1 }}>
                        보기 수
                      </InputLabel>
                      <Select
                        value={optCount}
                        label="보기 수"
                        onChange={e => setOptCount(Number(e.target.value))}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      >
                        {[3, 4, 5].map(num => (
                          <MenuItem
                            key={num}
                            value={num}
                            sx={{
                              borderRadius: 1,
                              mx: 1,
                              my: 0.5,
                              '&:hover': {
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                              },
                            }}
                          >
                            {num}개
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
                {qTab === 1 && (
                  <Box sx={{ flexBasis: '33.3333%' }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink sx={{ bgcolor: 'background.paper', px: 1 }}>
                        배열 개수
                      </InputLabel>
                      <Select
                        value={optCount}
                        label="배열 개수"
                        onChange={e => setOptCount(Number(e.target.value))}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      >
                        {[3, 4, 5].map(num => (
                          <MenuItem
                            key={num}
                            value={num}
                            sx={{
                              borderRadius: 1,
                              mx: 1,
                              my: 0.5,
                              '&:hover': {
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                              },
                            }}
                          >
                            {num}개
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
                {qTab === 2 && (
                  <Box sx={{ flexBasis: '33.3333%' }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink sx={{ bgcolor: 'background.paper', px: 1 }}>
                        빈칸 수
                      </InputLabel>
                      <Select
                        value={blankCount}
                        label="빈칸 수"
                        onChange={e => setBlankCount(Number(e.target.value))}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      >
                        {[1, 2, 3].map(num => (
                          <MenuItem
                            key={num}
                            value={num}
                            sx={{
                              borderRadius: 1,
                              mx: 1,
                              my: 0.5,
                              '&:hover': {
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                              },
                            }}
                          >
                            {num}개
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </Box>

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

              <Snackbar
                open={openQSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenQSnackbar(false)}
              >
                <Alert severity="success">문제가 저장되었습니다!</Alert>
              </Snackbar>
            </>
          )}
        </Container>
      </Box>
    </>
  )
}
