// src/pages/Mypage.tsx
import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Paper,
  IconButton, Menu, MenuItem, Pagination,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button
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
  text: string
}

const itemsPerPage = 5

export default function Mypage() {
  const { user } = useAuth()
  const [summaryItems, setSummaryItems] = useState<FileItem[]>([])
  const [questionItems, setQuestionItems] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // pagination
  const [summaryPage, setSummaryPage] = useState(1)
  const [questionPage, setQuestionPage] = useState(1)

  // 모달 열기 상태
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogText, setDialogText] = useState('')

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
        setSummaryItems(sRes.data.summaries.map(s => ({
          id: s.selection_id,
          name: s.file_name,
          date: new Date(s.created_at).toLocaleDateString('ko-KR'),
          text: s.summary_text,
        })))
        setQuestionItems(qRes.data.questions.map(q => ({
          id: q.selection_id,
          name: q.file_name,
          date: new Date(q.created_at).toLocaleDateString('ko-KR'),
          text: q.question_text,
        })))
      })
      .catch(() => setError('내역을 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return <Box textAlign="center" mt={8}><CircularProgress/></Box>
  if (error)   return <Box textAlign="center" mt={8}><Alert severity="error">{error}</Alert></Box>

  return (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100vh' }}>
      <Header/>
      
      <Box sx={{ pt: '60px', px:4, pb:6, maxWidth:1200, mx:'auto' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>마이페이지</Typography>
        <FileListSection
          title="📄 저장된 요약"
          items={summaryItems}
          currentPage={summaryPage}
          onPageChange={(_,p)=>setSummaryPage(p)}
          onView={(item)=> {
            setDialogTitle(item.name)
            setDialogText(item.text)
            setDialogOpen(true)
          }}
        />
        <FileListSection
          title="❓ 생성된 문제"
          items={questionItems}
          currentPage={questionPage}
          onPageChange={(_,p)=>setQuestionPage(p)}
          onView={(item)=> {
            setDialogTitle(item.name)
            setDialogText(item.text)
            setDialogOpen(true)
          }}
        />
      </Box>

      {/* 텍스트 보기 모달 */}
      <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{dialogText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDialogOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function FileListSection({
  title,
  items,
  currentPage,
  onPageChange,
  onView,
}: {
  title: string
  items: FileItem[]
  currentPage: number
  onPageChange: (e:React.ChangeEvent<unknown>, page:number)=>void
  onView: (item:FileItem)=>void
}) {
  const [anchorEl, setAnchorEl] = useState<null|HTMLElement>(null)
  const [activeItem, setActiveItem] = useState<FileItem|null>(null)
  const openMenu = Boolean(anchorEl)

  const handleMenuOpen = (e:React.MouseEvent<HTMLElement>, item:FileItem) => {
    setAnchorEl(e.currentTarget)
    setActiveItem(item)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
    setActiveItem(null)
  }
  const handleDownload = () => {
    if (!activeItem) return
    const base = activeItem.name.replace(/\.pdf$/i,'')
    const blob = new Blob([activeItem.text], { type:'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${base}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    handleMenuClose()
  }

  const start = (currentPage-1)*itemsPerPage
  const pageItems = items.slice(start, start+itemsPerPage)
  const total = Math.ceil(items.length/itemsPerPage)

  return (
    <Box mb={6}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>{title}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell align="center">날짜</TableCell>
              <TableCell align="right" sx={{ width:48 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageItems.map(item=>(
              <TableRow key={item.id} hover onClick={()=>onView(item)} sx={{ cursor:'pointer' }}>
                <TableCell>
                  <Box sx={{ display:'flex', alignItems:'center' }}>
                    <PictureAsPdfIcon color="error" sx={{ mr:1 }}/>
                    <Typography noWrap>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{item.date}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={e=>{ e.stopPropagation(); handleMenuOpen(e,item) }}>
                    <MoreVertIcon/>
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}
                        anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
                        transformOrigin={{ vertical:'top', horizontal:'right' }}>
                    <MenuItem onClick={handleDownload}>다운로드</MenuItem>
                    <MenuItem onClick={()=>{ /* TODO: 삭제 */ handleMenuClose() }}>
                      삭제
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display:'flex', justifyContent:'center', mt:2 }}>
        <Pagination count={total} page={currentPage} onChange={onPageChange}
                    shape="rounded" color="primary"/>
      </Box>
    </Box>
  )
}
