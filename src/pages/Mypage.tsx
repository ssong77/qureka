import React, { useState } from 'react';
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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Header from '../components/Header';

interface FileItem {
  name: string;
  size: string;
  date: string;
}

const summaryData: FileItem[] = [
  { name: '제 03장 메시지 처리.pdf', size: '3MB', date: '2025년 3월 12일' },
  { name: '제 04장 프로세스 관리.pdf', size: '2.5MB', date: '2025년 3월 13일' },
  { name: '제 05장 스레드와 병렬처리.pdf', size: '3.2MB', date: '2025년 3월 14일' },
  { name: '제 06장 입출력 시스템.pdf', size: '2.8MB', date: '2025년 3월 15일' },
];

const questionData: FileItem[] = [
  { name: '문제_01.pdf', size: '1MB', date: '2025년 3월 12일' },
  { name: '문제_02.pdf', size: '1MB', date: '2025년 3월 13일' },
  { name: '문제_03.pdf', size: '1MB', date: '2025년 3월 14일' },
  { name: '문제_04.pdf', size: '1MB', date: '2025년 3월 15일' },
];

const itemsPerPage = 3;

function FileListSection({
  title,
  items,
  currentPage,
  onPageChange,
}: {
  title: string;
  items: FileItem[];
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <Box mb={6}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '60%' }}>이름</TableCell>
              <TableCell align="center" sx={{ width: '20%' }}>크기</TableCell>
              <TableCell align="right" sx={{ width: '20%' }}>날짜</TableCell>
              <TableCell align="right" sx={{ width: '40px' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PictureAsPdfIcon color="error" sx={{ mr: 1 }} />
                    <Typography noWrap>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{item.size}</TableCell>
                <TableCell align="right">{item.date}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={handleMenuOpen}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>다운로드</MenuItem>
                    <MenuItem onClick={handleMenuClose}>삭제</MenuItem>
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
  );
}

function Mypage() {
  const [summaryPage, setSummaryPage] = useState(1);
  const [questionPage, setQuestionPage] = useState(1);

  return (
    <Box sx={{ bgcolor: '#f4f2f7', minHeight: '100vh' }}>
      <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 1100 }}>
        <Header />
      </Box>

      <Box sx={{ pt: '100px', px: 4, pb: 6, maxWidth: '1200px', mx: 'auto' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          마이페이지
        </Typography>

        <FileListSection
          title="요약 내용"
          items={summaryData}
          currentPage={summaryPage}
          onPageChange={(_, page) => setSummaryPage(page)}
        />
        <FileListSection
          title="생성된 문제"
          items={questionData}
          currentPage={questionPage}
          onPageChange={(_, page) => setQuestionPage(page)}
        />
      </Box>
    </Box>
  );
}

export default Mypage;
