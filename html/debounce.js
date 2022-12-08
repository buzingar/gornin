/**
  <Input style={{ marginBottom: 16 }} maxLength={25} onChange={userChange} />;

  const userChange = (e: any) => {
    callAjax(e.target.value);
  };

  const callAjax = _.debounce(getMember, 300);

  const getMember = (value: any) => {
    fetchMember(value); // 最终的获取ajax数据的方法
  };

  const fetchMember = () => {};
*/
