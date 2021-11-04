import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';

export default function ViewMore({ totalCount, viewMore, pageSize, reset = false, setReset, isAll = false }) {
  const [pageNumber, setPageNumber] = useState(1);
  const hide = useMemo(() => pageNumber * pageSize >= totalCount, [pageNumber, pageSize, totalCount]);

  const debounceViewMore = debounce((pageNumber) => viewMore(pageNumber), 500);

  const handleCountClick = (event) => {
    event.preventDefault();
    debounceViewMore(pageNumber + 1);
    setPageNumber((prev) => (prev += 1));
    setReset && setReset(false);
  };

  useEffect(() => (reset || isAll) && setPageNumber(1), [reset, isAll]);

  useEffect(() => setReset && setReset(false), []);

  return (
    <div className="btn_article comm_more line" style={{ visibility: hide ? 'hidden' : 'visible' }}>
      <a href="#none" className="more_btn" title="더보기" onClick={handleCountClick}>
        더보기
      </a>
    </div>
  );
}
