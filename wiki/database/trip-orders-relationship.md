1. Trips Table
```
trips (
    code,
    company_id,
    driver_id,
    vehicle_type_id,
    driver_vehicle_id,
    status ('pending', 'active', 'completed', 'cancelled'), -- Trip lifecycle status
    
    -- Distance & Duration
    distance, -- Total route distance (may differ from sum of order distances due to route optimization/batching)
    estimated_duration, -- Estimated total trip duration
    duration, -- Actual trip duration
    
    total_earnings,
    road_data JSONB, -- Optimized route data for the entire trip
    started_at,
    completed_at,
    cancelled_at,
    
    -- Cancellation (populated only if cancelled)
    cancelled_by_id,
    cancelled_by_type ('customer', 'driver', 'admin', 'system'),
    cancelled_reason,
    
    -- Rating (aggregate rating from all orders in trip)
    average_rating, -- Average of all order ratings in this trip
    total_ratings -- Count of orders that have been rated

)
```

2. Orders Table
```
orders (
    code,
    service_type ('delivery', 'taxi'),
    company_id,
    customer_id,
    trip_id,
    status ('pending', 'assigned', 'driver_arrived', 'departed', 'completed', 'cancelled'), -- Order lifecycle status
    
    -- Distance & Duration
    distance, -- Actual distance traveled for this specific order (may differ from trip route distance)
    estimated_duration, -- Estimated duration for this order
    actual_duration, -- Actual duration from assigned to completed
    pickup_road_data, -- Road data from trip start to pickup location
    dropoff_road_data, -- Road data from pickup to dropoff location

    -- DELIVERY-SPECIFIC FIELDS (nullable for taxi)
    item_size ('XS', 'S', 'M', 'L', 'XL', 'XXL'),
    item_weight,
    item_type ('Document', 'Food', 'Clothing', 'Electronics', 'Furniture'),
    item_description,
    is_fragile,
    requires_signature,
    requires_photo,
    
    -- TAXI-SPECIFIC FIELDS (nullable for delivery)
    passenger_count,
    passenger_names, -- JSON array of passenger names: ["John Doe", "Jane Doe"]
    special_requirements, -- JSON array: ["wheelchair", "child_seat", "pet_friendly", "luggage"]
    luggage_count,
    
    -- Pricing
    estimated_price,
    final_price,
    
    -- Price Breakdown (flexible for different pricing models)
    price_breakdown JSONB,
    -- Delivery example: {"base": 3.0, "distance": 5.0, "surcharge": 1.0, "total": 9.0}
    -- Taxi example: {"base_fare": 2.5, "distance_fare": 4.0, "time_fare": 1.5, 
    --                "surge_multiplier": 1.2, "total": 9.6}
    
    -- Payment
    payment_timing ('prepaid', 'postpaid'),
    payment_status ('unpaid', 'paid'),
    payment_method ('cash', 'wallet'),
    
    -- Priority
    priority ('normal', 'urgent', 'express'),
    
    -- Notes
    note,
    special_instructions,
    
    -- Rating (can only be set after order is completed and payment is paid)
    rating (rating >= 1 AND rating <= 5), -- Nullable, only set after completion and payment
    rating_comment,
    rating_at, -- Timestamp when customer submitted rating
    
    -- Cancellation (populated only if cancelled)
    cancelled_at,
    cancelled_by_id,
    cancelled_by_type ('customer', 'driver', 'admin', 'system'),
    cancelled_reason,
    
    -- Flags
    is_active, -- Boolean flag indicating if order is currently active (true unless cancelled or completed)
    
    -- Key Timestamps (for quick access without querying order_actions)
    assigned_at, -- When order status changed to 'assigned'
    driver_arrived_at, -- When order status changed to 'driver_arrived'
    departed_at, -- When order status changed to 'departed'
    completed_at -- When order status changed to 'completed'
)
```
3. Order Actions Table
```
order_actions (
    order_id,
    trip_id,
    
    -- Action Type (aligned with order status flow)
    action_type (
        'driver_assigned', -- When driver is assigned (status: pending -> assigned)
        'driver_arrived', -- When driver arrives at pickup (status: assigned -> driver_arrived)
        'departed', -- When driver departs from pickup (status: driver_arrived -> departed)
        'completed', -- When order is completed at dropoff (status: departed -> completed)
        'cancelled', -- When order is cancelled (status: * -> cancelled)
        'location_update', -- Real-time location tracking updates
        'payment_completed', -- When payment is processed
        'customer_rated' -- When customer submits rating (only after completion and payment)
    ),
    
    -- Status Change Details (populated for status transition actions)
    from_status, -- Previous status before transition
    to_status, -- New status after transition
    
    -- Location at time of action
    latitude,
    longitude,
    address,
    accuracy, -- GPS accuracy for this specific location reading
    
    -- Proof of delivery/pickup
    photo_url,
    signature_url,
    signature_name,
    
    -- Flexible metadata (can store any additional data as JSON)
    metadata JSONB,
    -- Examples:
    -- {"reason": "customer_not_home"} - for cancelled orders
    -- {"rating": 5, "comment": "Great service"} - for customer_rated action
    -- {"battery_level": 45, "speed": 35} - for location_update actions
    -- {"distance_to_destination": 2.5, "eta_minutes": 15} - for location_update actions
    -- {"payment_method": "cash", "amount": 8.50} - for payment_completed action
    -- {"driver_id": 5, "vehicle_type": "Tricycle"} - for driver_assigned action
    
    -- Notes/Comments
    notes,
    
    -- Actor (who performed this action)
    actor_id,
    actor_type ('driver', 'customer', 'admin', 'system')
)
```
4. Order Locations Table
```
order_locations (
    order_id,
    type ('pickup', 'dropoff'),
    sequence, -- Order/sequence for multi-stop orders (1 = first pickup, 2 = first dropoff, etc.)
    latitude,
    longitude,
    address,
    contact_name,
    contact_phone,
    notes -- e.g., "Ring bell", "Call on arrival"
)
```