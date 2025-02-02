erDiagram
    %% Note: This diagram shows both implemented and planned database structures
    %% (Implemented) indicates fully functional features
    %% (Basic) indicates basic implementation
    %% (Planned) indicates features not yet implemented

    users {
        INTEGER id PK
        TEXT email UNIQUE "NOT NULL"
        TEXT password "NOT NULL"
        TEXT username "NOT NULL"
        TEXT avatar "Basic profile image"
        TEXT role "DEFAULT 'user' NOT NULL"
        TEXT experience_level "Basic user level"
        TEXT bio "Basic user info"
        JSON preferences "Basic user settings"
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
        JSON route_data "Basic route data"
        BOOLEAN is_premium "DEFAULT false"
        INTEGER created_by FK "NOT NULL"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
    }

    trip_images {
        INTEGER id PK
        INTEGER trip_id FK "NOT NULL"
        TEXT image_url "NOT NULL"
        INTEGER order_index "Basic image ordering"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    reviews {
        INTEGER id PK
        INTEGER trip_id FK "NOT NULL"
        INTEGER user_id FK "NOT NULL"
        REAL rating "NOT NULL"
        TEXT content "NOT NULL"
        INTEGER reports "DEFAULT 0 (Basic)"
        TEXT status "Review moderation status"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
    }

    review_images {
        INTEGER id PK
        INTEGER review_id FK "NOT NULL"
        TEXT image_url "NOT NULL"
        INTEGER order_index "Basic image ordering"
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
        DECIMAL amount "Basic subscription amount"
        TEXT payment_method "Basic payment info"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
    }

    billing_history {
        INTEGER id PK
        INTEGER subscription_id FK "NOT NULL"
        DECIMAL amount "NOT NULL"
        TEXT description "NOT NULL"
        TEXT status "NOT NULL"
        TEXT payment_method "NOT NULL"
        DATETIME transaction_date "NOT NULL"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
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
        TEXT preferred_units "Basic preference"
        TEXT theme "Basic theme setting"
        TEXT language "Basic language setting"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        DATETIME updated_at "DEFAULT CURRENT_TIMESTAMP"
    }

    %% Implemented Relationships
    users ||--o{ trips : "creates (Implemented)"
    users ||--o{ reviews : "writes (Implemented)"
    trips ||--o{ trip_images : "contains (Implemented)"
    trips ||--o{ reviews : "receives (Implemented)"
    reviews ||--o{ review_images : "contains (Implemented)"
    users ||--|| user_preferences : "has (Basic)"
    
    %% Basic Implementation
    users ||--o{ followers : "follows (Basic)"
    users ||--o{ followers : "followed by (Basic)"
    users ||--o{ subscriptions : "subscribes to (Basic)"
    
    %% Planned Relationships
    achievements ||--o{ user_achievements : "awarded to (Planned)"
    subscriptions ||--o{ billing_history : "has (Planned)"
