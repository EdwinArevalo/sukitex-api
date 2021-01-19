module.exports = class Pagination {

    static paginate = ( page, size ) => {
        const offset = page * size;
        const limit = size;
      
        return {
          offset,
          limit,
        };
      };

      static getPagination = (page, size) => {
        const limit = size ? +size : 5;
        const offset = page ? page * limit : 0;

        return { limit, offset };
    };
    
    static getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: list } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
      
        return { totalItems, list, totalPages, currentPage };
    };
    
}


 