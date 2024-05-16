-- Criação dos tipos enumerados
CREATE TYPE notification_type AS ENUM ('email', 'push', 'sms');
CREATE TYPE notification_status AS ENUM ('pending', 'sent');

-- Tabela de notifications com tipos enumerados
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    activity_id INT NOT NULL,
    notification_type notification_type NOT NULL,
    notification_datetime TIMESTAMP NOT NULL,
    status notification_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(activity_id)
);