import React from 'react';
import { Pagination } from 'semantic-ui-react';


function PageChange (props) {
  const {data,changePage,activePage} = props;
    
  const onChange = (e, pageInfo) => {
  	var setActivePage = pageInfo.activePage;
    var b = setActivePage * 2 - 2;
    var e = setActivePage * 2;
    changePage(b,e,setActivePage)
  };  

  return (
    <Pagination
    totalPages={Math.ceil(data.length / 2)}
    activePage={activePage}
    onPageChange={onChange}
    //ellipsisItem={null}  
    //firstItem={null}
    //lastItem={null}
    />  
  )

};

export default PageChange;