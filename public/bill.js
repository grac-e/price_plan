document.addEventListener('alpine:init', () => {
    Alpine.data('pricePlan', () => ({
        pricePlans: [],
        selectedPricePlan: '',
        actions: '',
        newPlan: { name: '', call_cost: '', sms_cost: '' },
        updatePlan: { name: '', call_cost: '', sms_cost: '' },
        deletePlanId: '',
        showPricePlans: false,
        billTotal: '',
        showBillTotal: false, 

        init() {
            this.fetchPricePlans(); 
        },

        // Fetch all available price plans
        fetchPricePlans() {
            axios.get('/api/price_plans')
                .then(response => {
                    this.pricePlans = response.data.price_plans;
                })
                .catch(error => {
                    console.error('Error fetching price plans:', error);
                });
        },

        // Calculate phone bill based on selected price plan and actions
        calculatePhoneBill() {
            if (!this.selectedPricePlan || !this.actions.trim()) {
                alert('Please select a price plan and enter actions.');
                return;
            }

            axios.post('/api/phonebill', {
                price_plan: this.selectedPricePlan,
                actions: this.actions
            })
                .then(response => {
                    this.billTotal = response.data.total;
                    this.showBillTotal = true; 
                    setTimeout(() => {
                        this.showBillTotal = false; 
                    }, 4000);
                })
                .catch(error => {
                    console.error('Error calculating phone bill:', error);
                });
        },

        // Create a new price plan
        createPricePlan() {
            if (!this.newPlan.name || !this.newPlan.call_cost || !this.newPlan.sms_cost) {
                alert('All fields are required to create a price plan.');
                return;
            }

            axios.post('/api/price_plan/create', this.newPlan)
                .then(response => {
                    this.fetchPricePlans(); // Refresh list
                    this.newPlan = { name: '', call_cost: '', sms_cost: '' };
                    alert('Price plan created successfully!');
                })
                .catch(error => {
                    console.error('Error creating price plan:', error);
                });
        },

        // Update an existing price plan
        updatePricePlan() {
            if (!this.updatePlan.name || !this.updatePlan.call_cost || !this.updatePlan.sms_cost) {
                alert('All fields are required to update a price plan.');
                return;
            }

            axios.post('/api/price_plan/update', this.updatePlan)
                .then(response => {
                    this.fetchPricePlans(); // Refresh list
                    this.updatePlan = { name: '', call_cost: '', sms_cost: '' }; // Reset fields
                    alert('Price plan updated successfully!');
                })
                .catch(error => {
                    console.error('Error updating price plan:', error);
                });
        },

        // Delete a price plan
        deletePricePlan() {
            if (!this.deletePlanId) {
                alert('Please enter the ID of the price plan to delete.');
                return;
            }

            axios.post('/api/price_plan/delete', { id: this.deletePlanId })
                .then(response => {
                    this.fetchPricePlans(); // Refresh list
                    this.deletePlanId = ''; // Reset field
                    alert('Price plan deleted successfully!');
                })
                .catch(error => {
                    console.error('Error deleting price plan:', error);
                });
        },

        // Toggle showing the price plans
        togglePricePlans() {
            this.showPricePlans = !this.showPricePlans;
            if (this.showPricePlans) {
                this.fetchPricePlans();
            }
        }
    }));
});