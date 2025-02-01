erDiagram
    users {
        INTEGER id PK
        TEXT email UNIQUE "NOT NULL"
        TEXT password "NOT NULL"
        TEXT username "NOT NULL"
        TEXT avatar
        TEXT role "DEFAULT 'user' NOT NULL"
        TEXT experience_level
        TEXT bio "User biography"
        JSON preferences "User preferences JSON"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
    }

    trips {
        INTEGER id PK
        TEXT title "NOT NULL"
        TEXT description "NOT NULL"
        DATE start_date "NOT NULL"
        DATE end_date "NOT NULL"
        TEXT difficulty "NOT NULL"
        REAL distance "NOT NULL"
        JSON route_data "Stored route information"
        BOOLEAN is_premium "DEFAULT false"
        INTEGER created_by FK "NOT NULL"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
    }

    trip_images {
        INTEGER id PK
        INTEGER trip_id FK "NOT NULL"
        TEXT image_url "NOT NULL"
        INTEGER order_index "Image ordering"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    reviews {
        INTEGER id PK
        INTEGER trip_id FK "NOT NULL"
        INTEGER user_id FK "NOT NULL"
        REAL rating "NOT NULL"
        TEXT content "NOT NULL"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
    }

    review_images {
        INTEGER id PK
        INTEGER review_id FK "NOT NULL"
        TEXT image_url "NOT NULL"
        INTEGER order_index "Image ordering"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    followers {
        INTEGER id PK
        INTEGER follower_id FK "NOT NULL"
        INTEGER following_id FK "NOT NULL"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        UNIQUE "follower_id, following_id"
    }

    subscriptions {
        INTEGER id PK
        INTEGER user_id FK "NOT NULL"
        TEXT plan_type "NOT NULL"
        DATE start_date "NOT NULL"
        DATE end_date "NOT NULL"
        TEXT status "DEFAULT 'active'"
        DECIMAL amount "Subscription amount"
        TEXT payment_method
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
    }

    achievements {
        INTEGER id PK
        TEXT name UNIQUE "NOT NULL"
        TEXT description "NOT NULL"
        TEXT criteria "NOT NULL"
        TEXT icon_url "Achievement badge icon"
        INTEGER points "Achievement points value"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    user_achievements {
        INTEGER id PK
        INTEGER user_id FK "NOT NULL"
        INTEGER achievement_id FK "NOT NULL"
        DATETIME achieved_at "DEFAULT CURRENT_TIMESTAMP"
        UNIQUE "user_id, achievement_id"
    }

    user_preferences {
        INTEGER id PK
        INTEGER user_id FK "NOT NULL"
        BOOLEAN email_notifications "DEFAULT true"
        BOOLEAN push_notifications "DEFAULT true"
        TEXT preferred_units "km/miles preference"
        TEXT theme "light/dark mode"
        TEXT language "UI language preference"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
    }

    users ||--o{ trips : "creates"
    users ||--o{ reviews : "writes"
    users ||--o{ followers : "follows"
    users ||--o{ followers : "followed by"
    users ||--o{ subscriptions : "subscribes to"
    users ||--o{ user_achievements : "earns"
    users ||--|| user_preferences : "has"
    
    trips ||--o{ trip_images : "contains"
    trips ||--o{ reviews : "receives"
    
    reviews ||--o{ review_images : "contains"
    
    achievements ||--o{ user_achievements : "awarded to"
