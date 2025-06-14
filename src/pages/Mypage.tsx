// src/pages/Mypage.tsx
import React, { useEffect, useState } from 'react'
import { jsPDF } from 'jspdf'
import {
  Box, Typography, Paper,
  IconButton, Menu, MenuItem, Pagination,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar,
  Chip
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { summaryAPI, questionAPI } from '../services/api'

interface FileItem {
  id: number
  name: string
  date: string
  time: string
  createdAt: string // 날짜와 시간을 합친 정보
  text: string
  summaryType?: string // 요약 유형 추가
}

interface QuestionItem {
  id: number
  name: string
  date: string
  time: string
  createdAt: string // 날짜와 시간을 합친 정보
  text: string
  type: string
  displayType?: string // 표시용 문제 유형
  options?: string[]
  answer?: string
  correct_option_index?: number
  explanation?: string
}

interface IncorrectAnswerItem extends QuestionItem {
  user_answer: string | number
  is_correct: boolean
}

const itemsPerPage = 5

export default function Mypage() {
  const { user } = useAuth()
  const [summaryItems, setSummaryItems] = useState<FileItem[]>([])
  const [questionItems, setQuestionItems] = useState<QuestionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summaryPage, setSummaryPage] = useState(1)
  const [questionPage, setQuestionPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogText, setDialogText] = useState('')
  const [activeViewItem, setActiveViewItem] = useState<FileItem | QuestionItem | null>(null)
  // 확인 대화상자 관련 state 추가
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, type: 'summary' | 'question'} | null>(null);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false)
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<QuestionItem[]>([])
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string | number }>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [incorrectNoteOpen, setIncorrectNoteOpen] = useState(false)
  const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswerItem[]>(() => {
    const saved = localStorage.getItem('incorrectNotes')
    return saved ? JSON.parse(saved) : []
  })
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success'
  })

  // 폰트 로드
  useEffect(() => {
    fetch('/fonts/NotoSansKR-Regular.ttf')
      .then(res => res.arrayBuffer())
      .then(buf => {
        const b64 = btoa(
          new Uint8Array(buf).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
        // @ts-ignore
        jsPDF.API.addFileToVFS('NotoSansKR-Regular.ttf', b64)
        // @ts-ignore
        jsPDF.API.addFont('NotoSansKR-Regular.ttf', 'NotoSansKR', 'normal')
      })
      .catch(console.error)
  }, [])

  // 데이터 불러오기
  useEffect(() => {
    if (!user?.id) {
      setError('로그인이 필요합니다.')
      setLoading(false)
      return
    }
    
    Promise.all([
      summaryAPI.getUserSummaries(user.id),
      questionAPI.getUserQuestions(user.id),
    ])
      .then(([sRes, qRes]) => {
        setSummaryItems(sRes.data.summaries.map(s => {
          const date = new Date(s.created_at);
          // 유형 정보 매핑
          const summaryTypeMap: {[key: string]: string} = {
            'basic': '기본 요약',
            'concise': '핵심 요약',
            'topic': '주제 요약',
            'toc': '목차 요약',
            'keyword': '키워드 요약'
          };
          
          return {
            id: s.selection_id,
            name: s.file_name,
            date: date.toLocaleDateString('ko-KR'),
            time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            createdAt: date.toLocaleString('ko-KR', { 
              year: 'numeric', month: 'long', day: 'numeric', 
              hour: '2-digit', minute: '2-digit' 
            }),
            text: s.summary_text,
            summaryType: summaryTypeMap[s.summary_type] || '기본 요약'
          };
        }));
        
        setQuestionItems(qRes.data.questions.map(q => {
          const date = new Date(q.created_at);
          
          // 문제 유형 매핑
          const questionTypeMap: {[key: string]: string} = {
            'multiple-choice': '객관식',
            'short-answer': '주관식',
            'fill-in-the-blank': '빈칸 채우기',
            'ox-quiz': 'O/X 퀴즈'
          };
          
          try {
            const data = JSON.parse(q.question_text);
            return {
              id: q.selection_id,
              name: q.file_name,
              date: date.toLocaleDateString('ko-KR'),
              time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
              createdAt: date.toLocaleString('ko-KR', { 
                year: 'numeric', month: 'long', day: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
              }),
              text: data.question,
              type: data.type,
              displayType: questionTypeMap[data.type] || '기타',
              options: data.options,
              answer: data.answer,
              correct_option_index: data.correct_option_index,
              explanation: data.explanation,
            };
          } catch {
            return {
              id: q.selection_id,
              name: q.file_name,
              date: date.toLocaleDateString('ko-KR'),
              time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
              createdAt: date.toLocaleString('ko-KR', { 
                year: 'numeric', month: 'long', day: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
              }),
              text: q.question_text,
              type: 'unknown',
              displayType: '기타'
            };
          }
        }));
      })
      .catch(() => setError('내역을 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false))
  }, [user])

  // 오답 노트 로컬 저장
  useEffect(() => {
    localStorage.setItem('incorrectNotes', JSON.stringify(incorrectAnswers))
  }, [incorrectAnswers])

  // 다이얼로그 열기 함수
  const handleOpenDialog = (item: FileItem | QuestionItem) => {
    setDialogTitle(item.name);
    setDialogText(item.text);
    setActiveViewItem(item);
    setDialogOpen(true);
  };

  // 삭제 확인 다이얼로그 표시 함수
  const handleDeleteConfirm = (id: number, type: 'summary' | 'question') => {
    setItemToDelete({ id, type });
    setDeleteConfirmOpen(true);
  };
  
  // 실제 삭제 수행 함수
  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.type === 'summary') {
        await summaryAPI.deleteSummary(itemToDelete.id);
        setSummaryItems(prev => prev.filter(item => item.id !== itemToDelete.id));
        setSnackbar({ open: true, message: '요약이 삭제되었습니다.', severity: 'success' });
      } else {
        await questionAPI.deleteQuestion(itemToDelete.id);
        setQuestionItems(prev => prev.filter(item => item.id !== itemToDelete.id));
        setSnackbar({ open: true, message: '문제가 삭제되었습니다.', severity: 'success' });
      }
    } catch {
      setSnackbar({ 
        open: true, 
        message: `${itemToDelete.type === 'summary' ? '요약' : '문제'} 삭제에 실패했습니다.`, 
        severity: 'error' 
      });
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  // 퀴즈 채점
  const handleQuizSubmit = () => {
    setQuizSubmitted(true)
    const newIncorrect: IncorrectAnswerItem[] = []
    currentQuizQuestions.forEach(q => {
      const ua = userAnswers[q.id]
      let correct = false
      if (['multiple-choice', 'ox-quiz'].includes(q.type)) {
        correct = ua === q.correct_option_index
      } else {
        correct = (ua as string)?.toLowerCase().trim() === (q.answer as string)?.toLowerCase().trim()
      }
      if (!correct) {
        newIncorrect.push({
          ...q,
          user_answer: ua ?? '',
          is_correct: false
        })
      }
    })
    const updated = [...incorrectAnswers]
    newIncorrect.forEach(nq => {
      if (!updated.find(x => x.id === nq.id && x.name === nq.name)) {
        updated.push(nq)
      }
    })
    setIncorrectAnswers(updated)
  }

  // 오답 노트에서 삭제
  const handleDeleteIncorrectNote = (id: number, name: string) => {
    setIncorrectAnswers(prev => prev.filter(i => !(i.id === id && i.name === name)))
  }

  if (loading) return <Box textAlign="center" mt={8}><CircularProgress/></Box>
  if (error) return <Box textAlign="center" mt={8}><Alert severity="error">{error}</Alert></Box>

  return (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ pt: '60px', px: 4, pb: 6, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
          마이페이지
        </Typography>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<PictureAsPdfIcon />}
          sx={{ mb: 4 }}
          onClick={() => setIncorrectNoteOpen(true)}
        >
          오답 노트 보기
        </Button>

        <FileListSection
          title="📄 저장된 요약"
          items={summaryItems}
          currentPage={summaryPage}
          onPageChange={(_, p) => setSummaryPage(p)}
          onView={handleOpenDialog}
          onDelete={item => handleDeleteConfirm(item.id, 'summary')}
        />

        <FileListSection
          title="❓ 생성된 문제"
          items={questionItems}
          currentPage={questionPage}
          onPageChange={(_, p) => setQuestionPage(p)}
          onView={handleOpenDialog}
          onQuizStart={item => {
            const related = questionItems.filter(q => q.name === item.name)
            setCurrentQuizQuestions(related)
            setUserAnswers({})
            setQuizSubmitted(false)
            setQuizDialogOpen(true)
          }}
          onDelete={item => handleDeleteConfirm(item.id, 'question')}
        />
      </Box>

      {/* 상세 보기 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">{dialogTitle}</Typography>
            {/* 유형 정보 추가 */}
            {activeViewItem && (
              <Chip 
                label={
                  activeViewItem.hasOwnProperty('summaryType') 
                    ? (activeViewItem as FileItem).summaryType 
                    : (activeViewItem as QuestionItem).displayType || '기타'
                }
                size="small"
                color={activeViewItem.hasOwnProperty('summaryType') ? "primary" : "secondary"}
                variant="outlined"
              />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary" display="block">
            {activeViewItem?.createdAt}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ whiteSpace:'pre-wrap' }}>{dialogText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>

      {/* 퀴즈 풀이 다이얼로그 */}
      <Dialog open={quizDialogOpen} onClose={() => setQuizDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>문제 풀이: {currentQuizQuestions[0]?.name || '선택된 문제'}</DialogTitle>
        <DialogContent dividers>
          {currentQuizQuestions.map((q, idx) => (
            <Paper key={q.id} elevation={1} sx={{ p:2, mb:3 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Q{idx+1}. {q.text}
              </Typography>
              {/* 객관식/OX */}
              {['multiple-choice','ox-quiz'].includes(q.type) && q.options?.map((opt, i) => (
                <Box key={i} sx={{ display:'flex', alignItems:'center', mb:1 }}>
                  <input
                    type="radio" name={`q-${q.id}`} value={i}
                    checked={userAnswers[q.id] === i}
                    onChange={() => setUserAnswers(prev => ({ ...prev, [q.id]: i }))}
                    disabled={quizSubmitted}
                  />
                  <Typography ml={1}>{opt}</Typography>
                  {quizSubmitted && q.correct_option_index === i && (
                    <Typography sx={{ ml:1, color:'success.main', fontWeight:'bold' }}>정답</Typography>
                  )}
                  {quizSubmitted && userAnswers[q.id] === i && userAnswers[q.id] !== q.correct_option_index && (
                    <Typography sx={{ ml:1, color:'error.main', fontWeight:'bold' }}>오답</Typography>
                  )}
                </Box>
              ))}
              {/* 주관식 */}
              {['short-answer','fill-in-the-blank'].includes(q.type) && (
                <Box>
                  <input
                    type="text"
                    value={(userAnswers[q.id] as string)||''}
                    onChange={e => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    disabled={quizSubmitted}
                    style={{ width:'100%', padding:8, borderRadius:4, border:'1px solid #ccc' }}
                  />
                  {quizSubmitted && (
                    <Box mt={1}>
                      <Typography sx={{ color:'success.main' }}>정답: {q.answer}</Typography>
                      {userAnswers[q.id] && (userAnswers[q.id] as string).toLowerCase().trim() !== q.answer?.toLowerCase().trim() && (
                        <Typography sx={{ color:'error.main' }}>당신의 답변: {userAnswers[q.id]}</Typography>
                      )}
                    </Box>
                  )}
                </Box>
              )}
              {quizSubmitted && q.explanation && (
                <Box mt={2}>
                  <Typography variant="body2" sx={{ color:'text.secondary' }}>
                    **해설:** {q.explanation}
                  </Typography>
                </Box>
              )}
            </Paper>
          ))}
        </DialogContent>
        <DialogActions>
          {!quizSubmitted && (
            <Button onClick={handleQuizSubmit} variant="contained" color="primary">채점하기</Button>
          )}
          {quizSubmitted && (
            <Button onClick={() => setQuizDialogOpen(false)} variant="outlined" color="secondary">확인</Button>
          )}
          <Button onClick={() => setQuizDialogOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>

      {/* 오답 노트 다이얼로그 */}
      <Dialog open={incorrectNoteOpen} onClose={() => setIncorrectNoteOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>오답 노트</DialogTitle>
        <DialogContent dividers>
          {incorrectAnswers.length === 0
            ? <Typography>아직 오답이 없습니다.</Typography>
            : incorrectAnswers.map((q, idx) => (
                <Paper key={`${q.id}-${idx}`} elevation={1} sx={{ p:2, mb:3, bgcolor:'#fefafa' }}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    {idx+1}. {q.name} - {q.text}
                  </Typography>
                  {['multiple-choice','ox-quiz'].includes(q.type) && q.options?.map((opt, i) => (
                    <Box key={i} sx={{ display:'flex', alignItems:'center', mb:1 }}>
                      <Typography sx={{
                        ml:1,
                        color: q.correct_option_index===i ? 'success.main' : 'inherit',
                        fontWeight: q.correct_option_index===i ? 'bold':'normal'
                      }}>
                        {opt}
                      </Typography>
                      {q.correct_option_index===i && <Typography sx={{ ml:1, color:'success.main', fontWeight:'bold' }}>정답</Typography>}
                      {q.user_answer===i && q.user_answer!==q.correct_option_index && (
                        <Typography sx={{ ml:1, color:'error.main', fontWeight:'bold' }}>당신의 답변</Typography>
                      )}
                    </Box>
                  ))}
                  {['short-answer','fill-in-the-blank'].includes(q.type) && (
                    <Box>
                      <Typography sx={{ color:'success.main' }}>정답: {q.answer}</Typography>
                      <Typography sx={{ color:'error.main' }}>당신의 답변: {q.user_answer}</Typography>
                    </Box>
                  )}
                  {q.explanation && (
                    <Box mt={2}>
                      <Typography variant="body2" sx={{ color:'text.secondary' }}>
                        **해설:** {q.explanation}
                      </Typography>
                    </Box>
                  )}
                  <Button
                    variant="outlined" color="error" size="small" sx={{ mt:2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteIncorrectNote(q.id, q.name);
                    }}
                  >
                    오답 노트에서 삭제
                  </Button>
                </Paper>
              ))
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIncorrectNoteOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
      
      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          삭제 확인
        </DialogTitle>
        <DialogContent>
          <Typography>
            정말 이 {itemToDelete?.type === 'summary' ? '요약' : '문제'}을(를) 삭제하시겠습니까?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            삭제한 항목은 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>취소</Button>
          <Button onClick={handleDeleteConfirmed} color="error" autoFocus>
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function FileListSection({
  title, items, currentPage, onPageChange, onView, onQuizStart, onDelete
}: {
  title: string
  items: FileItem[] | QuestionItem[]
  currentPage: number
  onPageChange: (e: React.ChangeEvent<unknown>, p: number) => void
  onView: (item: FileItem | QuestionItem) => void
  onQuizStart?: (item: QuestionItem) => void
  onDelete?: (item: FileItem | QuestionItem) => void
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [activeItem, setActiveItem] = useState<FileItem | QuestionItem | null>(null)
  const openMenu = Boolean(anchorEl)

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, item: FileItem | QuestionItem) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
    setActiveItem(item)
  }
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveItem(null);
  };

  const handleDownload = async () => {
    if (!activeItem) return;
    
    try {
      // 내용 준비
      let textToDownload = activeItem.text;
      
      // 문제 데이터인 경우 포맷팅
      if (title === "❓ 생성된 문제" && typeof activeItem.text === 'string') {
        try {
          const data = JSON.parse(activeItem.text);
          textToDownload = `문제: ${data.question}\n\n`;
          data.options?.forEach((opt: string, i: number) => {
            textToDownload += `  ${i+1}. ${opt}\n`;
          });
          textToDownload += `\n정답: ${data.answer ?? (data.options && data.correct_option_index!==undefined ? data.options[data.correct_option_index] : '없음')}\n`;
          if (data.explanation) textToDownload += `해설: ${data.explanation}\n`;
        } catch (error) {
          console.error('문제 데이터 처리 중 오류:', error);
        }
      }
      
      // Blob 생성 및 다운로드
      const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      // 다운로드 링크 생성 및 자동 클릭
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeItem.name.replace(/\.(txt|pdf)?$/i, '')}.txt`;
      document.body.appendChild(link);
      link.click();
      
      // 정리
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      handleMenuClose();
    } catch (error) {
      console.error('다운로드 중 오류:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  const start = (currentPage - 1) * itemsPerPage
  const pageItems = items.slice(start, start + itemsPerPage)
  const total = Math.ceil(items.length / itemsPerPage)

  return (
    <Box mb={6}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>{title}</Typography>
      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell align="center">생성 날짜</TableCell>
              <TableCell align="center">유형</TableCell>
              <TableCell align="right" sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {pageItems.map(item => (
              <TableRow key={item.id} hover onClick={() => onView(item)} sx={{ cursor: 'pointer' }}>
                <TableCell>
                  <Box sx={{ display:'flex', alignItems:'center' }}>
                    <PictureAsPdfIcon color="error" sx={{ mr:1 }} />
                    <Typography noWrap>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{item.createdAt}</TableCell>
                <TableCell align="center">
                  {/* 유형 정보 표시 - 요약인지 문제인지에 따라 다른 정보 표시 */}
                  {title.includes('요약') ? (
                    <Chip 
                      label={(item as FileItem).summaryType || '기본 요약'} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  ) : (
                    <Chip 
                      label={(item as QuestionItem).displayType || '기타'} 
                      size="small" 
                      color="secondary" 
                      variant="outlined" 
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, item);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">저장된 항목이 없습니다.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {total > 0 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination 
            count={total} 
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
      
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={(event, reason) => {
          handleMenuClose();
        }}
        disableAutoFocusItem
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={(e) => {
          e.stopPropagation();
          onView(activeItem!);
          handleMenuClose();
        }}>
          보기
        </MenuItem>
        
        {/* 문제인 경우 '문제 풀기' 옵션 추가 */}
        {onQuizStart && activeItem && 'type' in activeItem && (
          <MenuItem onClick={(e) => {
            e.stopPropagation();
            onQuizStart(activeItem as QuestionItem);
            handleMenuClose();
          }}>
            문제 풀기
          </MenuItem>
        )}
        
        <MenuItem onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}>
          다운로드
        </MenuItem>
        
        {onDelete && activeItem && (
          <MenuItem onClick={(e) => {
            e.stopPropagation();
            onDelete(activeItem);
            handleMenuClose();
          }}>
            삭제
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}