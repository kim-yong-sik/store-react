
import Product from '../../../components/Product';

export default function ProductResult() {
  return (
    // <div className="product">
    <>
      <div className="section_top">
        <h2 className="title">제품<span>({productCount})</span></h2>
        <div className={`itemsort ${mobileOrderOpen ? "itemsort--open" : ""}`} aria-label="상품 정렬">
          <button className="itemsort__button" onClick={()=>{
              setMobileOrderOpen(!mobileOrderOpen)
          }}>
            <span className="itemsort__button__label sr-only">정렬기준:</span>
            <span className="itemsort__button__selected">{orderBy == "RECENT_PRODUCT" ? "최신순" : (orderBy == "TOP_PRICE" ? "높은 가격순" : "낮은 가격순")}</span>
          </button>
          <div className="itemsort__drawer">
            <ul className="itemsort__items">
            <li className={`itemsort__item ${orderBy == "RECENT_PRODUCT" ? "itemsort__item--active" : ""}`}><a  className="itemsort__item__link" onClick={()=>{
                setOrderBy("RECENT_PRODUCT")
            }}>최신순</a></li>
            <li className={`itemsort__item ${orderBy == "TOP_PRICE" ? "itemsort__item--active" : ""}`}><a  className="itemsort__item__link" onClick={()=>{
                setOrderBy("TOP_PRICE")
            }}>높은 가격순</a></li>
            <li className={`itemsort__item ${orderBy == "DISCOUNTED_PRICE" ? "itemsort__item--active" : ""}`}><a  className="itemsort__item__link" onClick={()=>{
                setOrderBy("DISCOUNTED_PRICE")
            }}>낮은 가격순</a></li>
            </ul>
          </div>
        </div>      
      </div>
      {/* item-list */}
      <div className="product__list product__list--lite">
        {/* item */}
        {productList && productList.map((item, itemIndex) => {
          return(<Product product={item} />)
        })}

      </div>
      {/* 더보기 버튼영역 */}
      <div className="btn_area">
        <button type="button" className="btn_more" title="제품 더보기">더보기<span className="ico_plus" /></button>
      </div>
      {/*// 더보기 버튼영역 */}
      </>
    // </div>
  )
}