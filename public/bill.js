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
            axios.post('/api/phonebill', {
                price_plan: this.selectedPricePlan,
                actions: this.actions
            })
                .then(response => {
                    this.billTotal = response.data.total;
                })
                .catch(error => {
                    console.error('Error calculating phone bill:', error);
                });
        },

        // Create a new price plan
        createPricePlan() {
            axios.post('/api/price_plan/create', this.newPlan)
                .then(response => {
                    this.fetchPricePlans(); // Refresh list
                    this.newPlan = { name: '', call_cost: '', sms_cost: '' }; 
                })
                .catch(error => {
                    console.error('Error creating price plan:', error);
                });
        },

        // Update an existing price plan
        updatePricePlan() {
            axios.post('/api/price_plan/update', this.updatePlan)
                .then(response => {
                    this.fetchPricePlans(); // Refresh list
                    this.updatePlan = { name: '', call_cost: '', sms_cost: '' }; // Reset fields
                })
                .catch(error => {
                    console.error('Error updating price plan:', error);
                });
        },

        // Delete a price plan
        deletePricePlan() {
            axios.post('/api/price_plan/delete', { id: this.deletePlanId })
                .then(response => {
                    this.fetchPricePlans(); // Refresh list
                    this.deletePlanId = ''; // Reset field
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