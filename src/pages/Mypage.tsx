// src/pages/Mypage.tsx
import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
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
  text: string      // 요약/문제 실제 텍스트
}

const itemsPerPage = 5

export default function Mypage() {
  const { user } = useAuth()
  const [summaryItems, setSummaryItems] = useState<FileItem[]>([])
  const [questionItems, setQuestionItems] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [summaryPage, setSummaryPage] = useState(1)
  const [questionPage, setQuestionPage] = useState(1)

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
        // summaries 배열에는 { selection_id, file_name, created_at, summary_text } 포함
        const mappedSummaries: FileItem[] = sRes.data.summaries.map(s => ({
          id: s.selection_id,
          name: s.file_name,
          date: new Date(s.created_at).toLocaleDateString('ko-KR'),
          text: s.summary_text
        }))
        // questions 배열에는 { selection_id, file_name, created_at, question_text } 포함
        const mappedQuestions: FileItem[] = qRes.data.questions.map(q => ({
          id: q.selection_id,
          name: q.file_name,
          date: new Date(q.created_at).toLocaleDateString('ko-KR'),
          text: q.question_text
        }))

        setSummaryItems(mappedSummaries)
        setQuestionItems(mappedQuestions)
      })
      .catch(() => {
        setError('내역을 불러오는 중 오류가 발생했습니다.')
      })
      .finally(() => setLoading(false))
  }, [user])

  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
      </Box>
    )
  }
  if (error) {
    return (
      <Box textAlign="center" mt={8}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#f4f2f7', minHeight: '100vh' }}>
      <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 1100 }}>
        <Header />
      </Box>
      <Box sx={{ pt: '100px', px: 4, pb: 6, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          마이페이지
        </Typography>

        <FileListSection
          title="📄 저장된 요약"
          items={summaryItems}
          currentPage={summaryPage}
          onPageChange={(_, p) => setSummaryPage(p)}
        />
        <FileListSection
          title="❓ 생성된 문제"
          items={questionItems}
          currentPage={questionPage}
          onPageChange={(_, p) => setQuestionPage(p)}
        />
      </Box>
    </Box>
  )
}

function FileListSection({
  title,
  items,
  currentPage,
  onPageChange,
}: {
  title: string
  items: FileItem[]
  currentPage: number
  onPageChange: (e: React.ChangeEvent<unknown>, page: number) => void
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [activeItem, setActiveItem] = useState<FileItem | null>(null)

  const openMenu = Boolean(anchorEl)
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, item: FileItem) => {
    setAnchorEl(e.currentTarget)
    setActiveItem(item)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
    setActiveItem(null)
  }

  const startIdx = (currentPage - 1) * itemsPerPage
  const currentItems = items.slice(startIdx, startIdx + itemsPerPage)
  const totalPages = Math.ceil(items.length / itemsPerPage)

  const handleDownload = () => {
    if (!activeItem) return
    const base = activeItem.name.replace(/\.pdf$/i, '')
    const blob = new Blob([activeItem.text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${base}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    handleMenuClose()
  }

  return (
    <Box mb={6}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell align="center">날짜</TableCell>
              <TableCell align="right" sx={{ width: 48 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PictureAsPdfIcon color="error" sx={{ mr: 1 }} />
                    <Typography noWrap>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{item.date}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={e => handleMenuOpen(e, item)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem onClick={handleDownload}>다운로드</MenuItem>
                    <MenuItem
                      onClick={() => {
                        /* TODO: 삭제 API 호출 후 목록 갱신 */
                        handleMenuClose()
                      }}
                    >
                      삭제
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={onPageChange}
          shape="rounded"
          color="primary"
        />
      </Box>
    </Box>
  )
}
