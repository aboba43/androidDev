


<form method="POST" action="index.php?action=update_order" class="m-0">
    <input type="hidden" name="order_id" value="<?= $order['id'] ?>">
    <select name="status" class="form-select form-select-sm" onchange="this.form.submit()">
        <option value="new" <?= $order['status'] === 'new' ? 'selected' : '' ?>>New</option>
        <option value="processing" <?= $order['status'] === 'processing' ? 'selected' : '' ?>>Processing</option>
        <option value="completed" <?= $order['status'] === 'completed' ? 'selected' : '' ?>>Completed</option>
    </select>
</form>





