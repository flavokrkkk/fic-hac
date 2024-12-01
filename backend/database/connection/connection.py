from sqlalchemy import ForeignKeyConstraint, Inspector, MetaData, NullPool, Table, create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.schema import DropConstraint, DropTable
from backend.database.models.base import Base
from backend.utils.config.config import DatabaseConfig, load_database_config


class DatabaseConnection:
    def __init__(self):
        self.config = load_database_config()
        self._engine = create_async_engine(
            url=f"postgresql+asyncpg://{self.config.db_user}:{self.config.db_pass}"
            f"@{self.config.db_host}:{self.config.db_port}/{self.config.db_name}",
            poolclass=NullPool,
        )

    async def get_session(self) -> AsyncSession:
        return AsyncSession(bind=self._engine)

    async def __call__(self, reset=False):
        if self.config.reset:
            sync_url = f'postgresql://{self.config.db_user}:{self.config.db_pass}@{self.config.db_host}:{self.config.db_port}/{self.config.db_name}'
            sync_engine = create_engine(sync_url)
            self.drop_everything(sync_engine)
        async with self._engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        return self

    def drop_everything(self, engine):
        con = engine.connect()
        trans = con.begin()
        inspector = Inspector.from_engine(engine)

        meta = MetaData()
        tables = []
        all_fkeys = []

        for table_name in inspector.get_table_names():
            fkeys = []

            for fkey in inspector.get_foreign_keys(table_name):
                if not fkey['name']:
                    continue

                fkeys.append(ForeignKeyConstraint((), (), name=fkey['name']))

            tables.append(Table(table_name, meta, *fkeys))
            all_fkeys.extend(fkeys)

        for fkey in all_fkeys:
            con.execute(DropConstraint(fkey))

        for table in tables:
            con.execute(DropTable(table))

        trans.commit()