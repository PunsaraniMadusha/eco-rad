# TODO

- [x] Update `app/admin/reward-redeem-management/page.tsx` to allow admin to mark a redemption as **pending** even after it was marked **completed**.
- [x] Add handler `setPending(id)` that updates `action: "pending"` and persists to `localStorage`.
- [x] Update UI Controls column to show **Mark Pending** for completed records.
- [x] Add confirmation prompt when switching `completed -> pending`.
- [ ] Sanity check by running/refreshing the relevant admin page and verifying persistence.


