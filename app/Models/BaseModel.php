<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

abstract class BaseModel extends Model
{
    use HasFactory;

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        // Auto-generate UUID if the model has a uuid column
        static::creating(function ($model) {
            if ($model->hasUuidColumn() && empty($model->uuid)) {
                $model->uuid = Str::uuid()->toString();
            }
        });
    }

    /**
     * Get the route key for the model.
     * Use UUID for API routes if uuid column exists, otherwise use default.
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        return $this->hasUuidColumn() ? 'uuid' : $this->getKeyName();
    }

    /**
     * Check if the model has a uuid column.
     *
     * @return bool
     */
    protected function hasUuidColumn(): bool
    {
        // Check if uuid is in fillable
        if (in_array('uuid', $this->getFillable())) {
            return true;
        }

        // Check if table exists and has uuid column
        try {
            $schema = $this->getConnection()->getSchemaBuilder();
            if ($schema->hasTable($this->getTable())) {
                return in_array('uuid', $schema->getColumnListing($this->getTable()));
            }
        } catch (\Exception $e) {
            // Table might not exist yet during migrations
            return false;
        }

        return false;
    }
}
