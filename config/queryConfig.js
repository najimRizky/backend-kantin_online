export const isNotDeleted = [
    { is_deleted: false },
    { is_deleted: null },
    { is_deleted: { $exists: false } }
]