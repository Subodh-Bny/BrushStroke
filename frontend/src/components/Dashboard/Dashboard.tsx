"use client";

import React from "react";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import routes from "@/config/routes";
import { useGetAnalytics } from "@/services/api/analyticsApi";

export function Dashboard() {
  const { data: analytics } = useGetAnalytics();
  const router = useRouter();

  const totalNewOrders = analytics ? analytics.newOrders.length : 0;

  return (
    <>
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rs.&nbsp;{analytics ? analytics.totalRevenue : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {`${
                      analytics && analytics?.revenueChangePercent > 0
                        ? `+${analytics.revenueChangePercent}`
                        : `${analytics?.revenueChangePercent}`
                    }% from last month`}
                  </p>
                </CardContent>
              </Card>
              <Card
                onClick={() => router.push(routes.admin.orders)}
                className="hover:cursor-pointer"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    New Orders
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{totalNewOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {`${
                      analytics && analytics?.orderChangePercent > 0
                        ? `+${analytics.orderChangePercent}`
                        : `${analytics?.orderChangePercent}`
                    }% from last week`}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    New Customers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    +{analytics ? analytics.newCustomers : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {`${
                      analytics && analytics?.customerChangePercent > 0
                        ? `+${analytics.customerChangePercent}`
                        : `${analytics?.customerChangePercent}`
                    }% from last month`}
                  </p>
                </CardContent>
              </Card>
              <Card onClick={() => router.push(routes.admin.artworks.view)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Available Artworks
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics ? analytics.totalAvailableArtworks : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {`${
                      analytics && analytics?.availableArtworkChangePercent > 0
                        ? `+${analytics.availableArtworkChangePercent}`
                        : `${analytics?.availableArtworkChangePercent}`
                    }% from last month`}
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Recent orders will be displayed here.</p>
                </CardContent>
              </Card>
            </div> */}
          </TabsContent>
          {/* <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>
                  View detailed sales analytics here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Sales analytics charts and graphs will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent> */}
          {/* <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>
                  Create custom reports for your e-commerce store.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="report-type">Report Type</Label>
                      <Input
                        id="report-type"
                        placeholder="Select report type"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="date-range">Date Range</Label>
                      <Input id="date-range" placeholder="Select date range" />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent> */}
          {/* <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage your notification settings and view recent alerts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Recent notifications and settings will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </main>
    </>
  );
}
