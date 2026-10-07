import psycopg

class DatabaseHandler:
    def __init__(self, db_name, user, password, host='localhost', port=5432):
        self.db_name = db_name
        self.user = user
        self.password = password
        self.host = host
        self.port = port

    def save_data(self, data, index_name, ma_window):

        with psycopg.connect(
            dbname=self.db_name,
            user=self.user,
            password=self.password,
            host=self.host,
            port=self.port
        ) as conn:
            with conn.cursor() as cur:
                for date, row in data.iterrows():
                    cur.execute("""
                        INSERT INTO market_breadth (date, index_name, ma_window, count, total, percentage)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (date, index_name, ma_window) DO NOTHING;
                    """, (date.date(), index_name, ma_window, row['count'], row['total'], row['percentage']))

    def create_table(self):
        with psycopg.connect(
            dbname=self.db_name,
            user=self.user,
            password=self.password,
            host=self.host,
            port=self.port
    ) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS market_breadth (
                        id SERIAL PRIMARY KEY,
                        date DATE NOT NULL,
                        index_name VARCHAR(50) NOT NULL,
                        ma_window INTEGER NOT NULL,
                        count INTEGER NOT NULL,
                        total INTEGER NOT NULL,
                        percentage NUMERIC(5,2) NOT NULL,
                        UNIQUE (date, index_name, ma_window)
                    );
                """)


    def create_index_table(self):
        with psycopg.connect(
            dbname=self.db_name,
            user=self.user,
            password=self.password,
            host=self.host,
            port=self.port
        ) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS index_data (
                        id SERIAL PRIMARY KEY,
                        date DATE NOT NULL,
                        index_name VARCHAR(50) NOT NULL,
                        close_price NUMERIC(10, 2) NOT NULL,
                        UNIQUE (date, index_name)
                    );
                """)


    def save_index_data(self, index_data, index_name):

        with psycopg.connect(
            dbname=self.db_name,
            user=self.user,
            password=self.password,
            host=self.host,
            port=self.port
        ) as conn:
            with conn.cursor() as cur:
                for date, close_price in index_data.items():
                    cur.execute("""
                        INSERT INTO index_data (date, index_name, close_price)
                        VALUES (%s, %s, %s)
                        ON CONFLICT (date, index_name) DO NOTHING;
                    """, (date.date(), index_name, close_price))


    def get_index_data(self, index_name):
        with psycopg.connect(
            dbname=self.db_name,
            user=self.user,
            password=self.password,
            host=self.host,
            port=self.port
        ) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT date, close_price
                    FROM index_data
                    WHERE index_name = %s
                    ORDER BY date;
                """, (index_name,))

                rows = cur.fetchall()

                return [
                    {
                        "date": row[0],
                        "close": float(row[1])
                    }
                    for row in rows
                ]


    def create_ma200_table(self):
        with psycopg.connect(
            dbname=self.db_name,
            user=self.user,
            password=self.password,
            host=self.host,
            port=self.port
        ) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS ma200_data (
                        id SERIAL PRIMARY KEY,
                        date DATE NOT NULL,
                        index_name VARCHAR(50) NOT NULL,
                        ma_window INTEGER NOT NULL,
                        count INTEGER NOT NULL,
                        total INTEGER NOT NULL,
                        percentage NUMERIC(5,2) NOT NULL,
                        UNIQUE (date, index_name, ma_window)
                    );
                """)

    
    def save_ma200_data(self, data, index_name, ma_window):
    
            with psycopg.connect(
                dbname=self.db_name,
                user=self.user,
                password=self.password,
                host=self.host,
                port=self.port
            ) as conn:
                with conn.cursor() as cur:
                    for date, row in data.iterrows():
                        cur.execute("""
                            INSERT INTO ma200_data (date, index_name, ma_window, count, total, percentage)
                            VALUES (%s, %s, %s, %s, %s, %s)
                            ON CONFLICT (date, index_name, ma_window) DO NOTHING;
                        """, (date.date(), index_name, ma_window, row['count'], row['total'], row['percentage']))



    def get_data(self, index_name, ma_window):
        with psycopg.connect(
            dbname=self.db_name,
            user=self.user,
            password=self.password,
            host=self.host,
            port=self.port
        ) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT date, count, total, percentage
                    FROM market_breadth
                    WHERE index_name = %s AND ma_window = %s
                    ORDER BY date;
                """, (index_name, ma_window))

                rows = cur.fetchall()

                return [
                    {
                        "date": row[0],
                        "count": row[1],
                        "total": row[2],
                        "percentage": float(row[3])
                    }
                    for row in rows
                ]


    def get_ma200_data(self, index_name, ma_window):
        with psycopg.connect(
            dbname=self.db_name,
            user=self.user,
            password=self.password,
            host=self.host,
            port=self.port
        ) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT date, count, total, percentage
                    FROM ma200_data
                    WHERE index_name = %s AND ma_window = %s
                    ORDER BY date;
                """, (index_name, ma_window))

                rows = cur.fetchall()

                return [
                    {
                        "date": row[0],
                        "count": row[1],
                        "total": row[2],
                        "percentage": float(row[3])
                    }
                    for row in rows
                ]
        
