<?php
namespace App\Repositories;

abstract class BaseRepository {
    public $model;

    public function __construct($model) {
        $this->model = new $model;
    }

    public function find($id) {
        return $this->model->find($id);
    }

    public function list() {
        return $this->model->get();
    }

    /**
     * Create new
     *
     * @param $data
     *
     * @return {BaseModel}
     */
    public function create($data) {
        $item = $this->model->create($data);
        $item->save();

        return $item;
    }

    /**
     * Update
     *
     * @param $data
     *
     * @return {BaseModel}
     */
    public function update($data) {
        $obj = $this->model->find($data['id']);
        $obj->update($data);

        return true;
    }

    /**
     * Delete
     *
     * @param {int} id
     *
     * @return {BaseModel}
     */
    public function delete($id) {
        $obj = $this->model->find($id);
        $obj->delete();

        return true;
    }

    /**
     * Repo success
     *
     * @param {Object} $data
     *
     * @return {any}
     */
    public function getSuccess($data) {
        return $data;
    }

    /**
     * Repo error
     *
     * @param {Exception} $e
     *
     * @return {any}
     */
    public function getError($e) {
        return [
            'error' => true,
            'message' => $e->getMessage()
        ];
    }
}

?>
