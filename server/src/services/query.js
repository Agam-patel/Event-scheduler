const default_page_limit=0;//return all documents on first page

function getPagination(query){
const limit=Math.abs(query.limit)||default_page_limit;
const page=Math.abs(query.page)||1;
const skip=(page-1)*limit;
return {skip,limit};
}
module.exports={
                    getPagination,
}