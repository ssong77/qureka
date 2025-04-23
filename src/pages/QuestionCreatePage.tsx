import React, { useState } from 'react';
import {
  Box, Typography, Grid, Paper, Tabs, Tab,
  FormControl, InputLabel, Select, MenuItem, Container, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function QuestionCreatePage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderSelect = (label, options) => (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Select defaultValue="">
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderRightSideContent = () => {
    return (
      <>
        <Paper sx={{ p: 2, mb: 2, height: 150 }}>
          <Typography>[문제 예시]</Typography>
          <Typography variant="body2">[문제 유형 선택 시 여기에 형식이 표시됩니다]</Typography>
        </Paper>

        <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
          <Tab label="공통 설정" />
          <Tab label="N지 선다형" />
          <Tab label="순서 배열형" />
          <Tab label="빈칸형" />
        </Tabs>

        {selectedTab === 0 && (
          <>
            {renderSelect('분야', ['언어', '과학', '사회', '경제', '인문학', '종교', '철학', '공학'])}
            {renderSelect('요약 수준', ['고등학생', '대학생'])}
            {renderSelect('글자 수', ['200-500자'])}
            {renderSelect('난이도', ['고등학생', '대학생'])}
            {renderSelect('문제 수', ['1', '2', '3', '4', '5'])}
          </>
        )}
        {selectedTab === 1 && (
          <>
            {renderSelect('보기 수', ['4', '5'])}
            {renderSelect('보기 형식', ['단답형', '문장형'])}
          </>
        )}
        {selectedTab === 2 && (
          <>
            {renderSelect('선택지 수', ['3', '4', '5', '6'])}
          </>
        )}
        {selectedTab === 3 && (
          <>
            {renderSelect('빈칸 수', ['1', '2'])}
          </>
        )}

        {/* 문제 생성 버튼 + 돌아가기 버튼 */}
        <Box textAlign="center" mt={3}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => navigate('/upload')}
              >
                ← 문서 요약으로 돌아가기
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary">
                ✦ 문제 생성
              </Button>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h6" gutterBottom>문제 생성 설정 페이지</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ height: '100%', p: 2, overflowY: 'auto', minHeight: 500 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>요약된 내용</Typography>
            <Box sx={{ whiteSpace: 'pre-line' }}>
              목차 요약{`\n`}소프트웨어 개발 방법론 개요{`\n`}전통적 개발 모델: 폭포수, 프로토타입{`\n`}반복적/점증적 모델: 나선형, RAD{`\n`}애자일 방법론 및 XP, Scrum{`\n`}방법론 선택 시 고려 요소
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          {renderRightSideContent()}
        </Grid>
      </Grid>
    </Container>
  );
}

export default QuestionCreatePage;
