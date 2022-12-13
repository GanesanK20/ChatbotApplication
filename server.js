var express = require('express');
var app = express();
const sql = require('mssql');
var bodyParser = require('body-parser');
app.use(express.static("/public"));
app.use(express.static(__dirname + "/webapp"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', (request, response) => {
    var { bot_name, year, month, system, created_date, created_time } = request.body;
    const config = {

        server: "testtidewserver.database.windows.net",
        port: 1433,
        user: "kganesan",
        password: "Yaltech1",
        database: "testtidewdbase"

    };

    async function getDBUsersAsyncFunction(bot_name, year, month, system, created_date, created_time) {
        try {
            const pool = await sql.connect(config);
            var countquery = "SELECT COUNT(*) FROM MEC_LOGS";
            var seq_no = await pool.request().query(countquery);
            seq_no = seq_no + 1;
            const InsertQuery = "INSERT INTO [dbo].[mec_logs] ([bot_name], [year], [month],[system],[created_date], [created_time])  VALUES('" + bot_name + "', '" + year + "', '" + month + "', '" + system + "', '" + created_date + "', '" + created_time + "')";
            const result = await pool.request().query(InsertQuery);
            console.log(result);
            app.get('/success', (s_request, s_response) => {
                s_response.json({ success: "Success" });
            });
        } catch (err) {
            console.log(err.message);
            app.get('/error', (e_request, e_response) => {
                e_response.json({ error: "Error" });
            });
        }
    };
    getDBUsersAsyncFunction(bot_name, year, month, system, created_date, created_time);

    response.send({
        bot_name,
        year,
        month,
        system,
        created_date,
        created_time
    })
});

app.listen(8080, () => {
    console.log('Node JS Server Running On Port : 8080');
});