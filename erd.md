erDiagram
    users {
        INTEGER id PK
        TEXT email UNIQUE "NOT NULL"
        TEXT password "NOT NULL"
        TEXT username "NOT NULL"
        TEXT avatar
        TEXT role "DEFAULT 'user' NOT NULL"
        TEXT experience_level
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    trips {
        INTEGER id PK
        TEXT title "NOT NULL"
        TEXT description "NOT NULL"
        DATE start_date "NOT NULL"
        DATE end_date "NOT NULL"
        TEXT difficulty "NOT NULL"
        REAL distance "NOT NULL"
        INTEGER created_by FK "NOT NULL"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    trip_images {
        INTEGER id PK
        INTEGER trip_id FK "NOT NULL"
        TEXT image_url "NOT NULL"
    }

    reviews {
        INTEGER id PK
        INTEGER trip_id FK "NOT NULL"
        INTEGER user_id FK "NOT NULL"
        REAL rating "NOT NULL"
        TEXT content "NOT NULL"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    review_images {
        INTEGER id PK
        INTEGER review_id FK "NOT NULL"
        TEXT image_url "NOT NULL"
    }

    followers {
        INTEGER id PK
        INTEGER follower_id FK "NOT NULL"
        INTEGER following_id FK "NOT NULL"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    subscriptions {
        INTEGER id PK
        INTEGER user_id FK "NOT NULL"
        DATE start_date "NOT NULL"
        DATE end_date "NOT NULL"
        TEXT status "DEFAULT 'active'"
    }

    achievements {
        INTEGER id PK
        TEXT name UNIQUE "NOT NULL"
        TEXT description "NOT NULL"
        TEXT criteria "NOT NULL"
    }

    user_achievements {
        INTEGER id PK
        INTEGER user_id FK "NOT NULL"
        INTEGER achievement_id FK "NOT NULL"
        DATETIME achieved_at "DEFAULT CURRENT_TIMESTAMP"
    }

    users ||--o{ trips : "creates"
    trips ||--o{ trip_images : "has"
    trips ||--o{ reviews : "has"
    users ||--o{ reviews : "creates"
    reviews ||--o{ review_images : "has"
    users ||--o{ followers : "follows"
    users ||--o{ followers : "followed by"
    users ||--o{ subscriptions : "has"
    users ||--o{ user_achievements : "earns"
    achievements ||--o{ user_achievements : "is earned by"
