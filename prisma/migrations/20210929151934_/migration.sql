-- CreateTable
CREATE TABLE `user` (
    `id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `phone` VARCHAR(45) NOT NULL,
    `addr` VARCHAR(150),
    `is_play` INTEGER NOT NULL DEFAULT 1,
    `create_time` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
