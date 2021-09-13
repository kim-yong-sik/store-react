const paymentType = {
  creditCard: {
    pgType: 'INICIS',
    payType: 'CREDIT_CARD',
    label: '신용 카드',
  },
  virtualAccount: {
    pgType: 'INICIS',
    payType: 'VIRTUAL_ACCOUNT',
    label: '가상 계좌',
  },
  nPay: {
    pgType: 'NAVER_PAY',
    payType: 'NAVER_PAY',
    label: '네이버 페이',
  },
};

export default paymentType;