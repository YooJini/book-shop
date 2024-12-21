const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');  // http-status-codes 모듈

const getAllBooks = (req, res) => {
    let { category_id, is_new, limit, current_page } = req.query;

    let offset = limit * (current_page - 1);
    let values = [];
    let sql = 'SELECT * FROM books';

    const isNew = is_new === 'true';

    if (category_id && isNew) {
        sql += ' WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values = [category_id];
    }
    else if (category_id) {
        sql += ' WHERE category_id=?';
        values = [category_id];
    }
    else if (isNew) {
        sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    }

    sql += ' LIMIT ? OFFSET ?';
    values.push(parseInt(limit), offset);
    
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
        }

        if (results.length) {
            return res.status(StatusCodes.OK).json(results);
        }

        return res.status(StatusCodes.NOT_FOUND).end();
    });
};

const getBookDetail = (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    const sql = 'SELECT * FROM books WHERE id=?';
    conn.query(sql, id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
        }

        const bookDetail = results[0];
        if (bookDetail) {
            return res.status(StatusCodes.OK).json(bookDetail);
        }

        return res.status(StatusCodes.NOT_FOUND).end();
    });
};

module.exports = {
    getAllBooks,
    getBookDetail,
};